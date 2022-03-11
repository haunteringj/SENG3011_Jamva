from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
try: 
  from articleEndPoints import *
except:
  from .articleEndPoints import *

# connect to database
cred = credentials.Certificate("../firebasePrivateKey.json")
firebase_admin.initialize_app(cred, {'projectId': "jamva-4e82e",})
db = firestore.client()

app = FastAPI()

@app.get("/v1/alive")
def alive():
  return {"hello": "JAMVA"}

# Articles endpoints
@app.get("/articles/latest")
def fetchlatestArt():
  return fetchlatestArticle(db)

@app.get("/articles/search/id")
def fetchByIdArt(id):
  return fetchByIdArticle(db, id)

@app.get("/articles/search/country")
def fetchByCou(country):
  return fetchByCountry(db, country)

@app.get("/articles/search/disease")
def fetchByDis(disease):
  return fetchByDisease(db, disease)

@app.get("/articles/search/date")
def fetchByDate(startDate, endDate = ""):
  return fetchByDateArticle(db, startDate, endDate)
