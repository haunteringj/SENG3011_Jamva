from fastapi import FastAPI, status, HTTPException
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from UserEndpoints.userEndPoints import createUserEntry, getUserDetail

from UserEndpoints.userModel import userCreationModel, userIdModel

# connect to database
cred = credentials.Certificate("../firebasePrivateKey.json")
firebase_admin.initialize_app(cred, {'projectId': "jamva-4e82e",})
db = firestore.client()

app = FastAPI()

def getApp():
  return app

@app.get("/v1/alive", status_code=status.HTTP_200_OK)
def alive():
  return {"hello": "JAMVA"}

#-- USER ENDPOINTS --#

@app.post("/v1/users/create", status_code=status.HTTP_201_CREATED)
def createUser(user : userCreationModel):
  return createUserEntry(db, user)

@app.delete("/v1/users/delete/{uid}", status_code=status.HTTP_204_NO_CONTENT)
def deleteUser(uid: str):
  return deleteUser(db, uid)

@app.get("/v1/users/details/{uid}", status_code=status.HTTP_200_OK)
def getUser(uid: str):
  return getUserDetail(db, uid)