from fastapi import FastAPI
import firebase_admin
from fastapi.responses import JSONResponse

from firebase_admin import credentials
from firebase_admin import firestore
from PHASE_1.API_SourceCode.diseaseData import globalData, countryData
import json

# connect to database
cred = credentials.Certificate("PHASE_1/serviceAccountKey.json")
firebase_admin.initialize_app(
    cred,
    {
        "projectId": "jamva-4e82e",
    },
)
db = firestore.client()
app = FastAPI()



@app.get("/v1/alive")
async def alive():
    return {"hello": "JAMVA"}


@app.get("/diseaseData/global")
async def diseaseDataGlobal():
    return globalData(db)


@app.get("/diseaseData/{countryId}")
async def diseaseDataGlobal(countryId):
    return countryData(db, countryId)
