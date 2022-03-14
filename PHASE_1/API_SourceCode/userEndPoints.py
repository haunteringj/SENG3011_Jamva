from Helpers.responseHelpers import toJsonResponse
from fastapi import status, HTTPException
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth
from firebase_admin import exceptions

from UserEndpoints.userModel import userCreationModel

def createUserEntry(db, userInfo: userCreationModel):
  try:
    user = auth.create_user(
      email= userInfo.email,
      password = userInfo.password
    )
    successResponse = {"status": "success", "uid": user.uid}
    return toJsonResponse(201, successResponse)
  except exceptions.FirebaseError:
    failedReponse = {"status": "failed_userExists", "uid": 0}
    return toJsonResponse(201, failedReponse)
  except ValueError:
    failedReponse = {"status": "failed_valueError", "uid": 0}
    return toJsonResponse(201, failedReponse)

def deleteUser(db, userId: str):
  try:
    auth.delete_user(userId)
    return toJsonResponse(204)
  except:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with {userId} wasn't found")

def getUserDetail(db, user: str):
  return toJsonResponse(200)
