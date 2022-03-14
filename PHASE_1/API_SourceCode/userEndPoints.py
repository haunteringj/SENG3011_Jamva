from fastapi import status, HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth
from firebase_admin import exceptions
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
    auth.delete_user(userId)
    db.collection("userDetails").document(userId).delete()
    return toJsonResponse(204)
  except:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with {userId} wasn't found")

def getUserDetail(db, uid: str):
  #
  try:
    query = db.collection("userDetails").doc(uid).get()
  except:
    return toJsonResponse(500, "User id doesnt exist")
  queryDict = query.to_dict()
  jsonData = json.dumps(queryDict)
  return toJsonResponse(200, jsonData)
