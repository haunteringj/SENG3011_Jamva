from getpass import getuser
from fastapi import status, HTTPException
from fastapi.responses import JSONResponse
from firebase_admin import auth
from firebase_admin import exceptions
from firebase_admin import firestore
import json
from pydantic import BaseModel

class userCreationModel(BaseModel):
  email: str
  country: str
  username: str
  city: str = None
  state: str
  password: str
  age: int = None

class userIdModel(BaseModel):
  uid: str

# Reorders the queryresults to have a consistent format
def reorderFields(queryResult):
    orderOfFields = ["username", "city", "state", "age", "alerts", "country"]
    return {k: queryResult.to_dict()[k] for k in orderOfFields}

def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(content, default=str),
    )

def createUserEntry(db, userInfo: userCreationModel):
  try:
    user = auth.create_user(
      email= userInfo.email,
      password = userInfo.password
    )
    successResponse = {"status": "success", "uid": user.uid}
    createUserDetail = {
      "username": userInfo.username,
      "country": userInfo.country,
      "state": userInfo.state,
      "city": userInfo.city,
      "age": userInfo.age,
      "alerts": [],
    }
    try:
      db.collection("userDetails").document(user.uid).set(createUserDetail)
      db.collection("countries").document(userInfo.country).update({"users": firestore.ArrayUnion([user.uid])})
      return toJsonResponse(201, successResponse)
    except:
      return toJsonResponse(409, {"status": "failed_userDetailExists", "uid": 0})
  except exceptions.FirebaseError:
    failedReponse = {"status": "failed_userExists", "uid": 0}
    return toJsonResponse(409, failedReponse)
  except ValueError:
    failedReponse = {"status": "failed_valueError", "uid": 0}
    return toJsonResponse(400, failedReponse)

def deleteUserEntry(db, userId: str):
  try:
    query = db.collection("userDetails").document(userId).get()
    queryDict = reorderFields(query)
    country = queryDict["country"]
    db.collection("countries").document(country).update({"users": firestore.ArrayRemove([userId])})
    auth.delete_user(userId)
    db.collection("userDetails").document(userId).delete()
    return toJsonResponse(204, {})
  except:
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"user with {userId} wasn't found")

def getUserDetail(db, uid: str):
  #
  try:
    query = db.collection("userDetails").document(uid).get()
  except:
    return toJsonResponse(500, "User id doesnt exist")
  queryDict = reorderFields(query)
  return toJsonResponse(200, queryDict)
  
