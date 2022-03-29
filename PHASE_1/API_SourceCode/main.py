from array import array
from typing import List

from sqlite3 import Timestamp
from tkinter.messagebox import QUESTION
from fastapi import FastAPI, status, Request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from fastapi.middleware.cors import CORSMiddleware

# import requests
import time
import datetime

try:
    from diseaseData import globalData, countryData
    from diseasesEndpoints import *
    from articleEndPoints import *
    from userEndPoints import *

    # connect to real database
    cred = credentials.Certificate("../dataBasePrivateKey.json")
    firebase_admin.initialize_app(
        cred,
        {
            "projectId": "jamva-real",
        },
    )
except:
    from .diseasesEndpoints import *
    from .diseaseData import globalData, countryData
    from .articleEndPoints import *
    from .userEndPoints import *

    # connect to test database
    cred = credentials.Certificate("../testDataBasePrivateKey.json")
    firebase_admin.initialize_app(
        cred,
        {
            "projectId": "jamva-4e82e",
        },
    )


class userCreationModel(BaseModel):
    email: str
    country: str
    username: str
    state: str
    city: str = None
    password: str
    age: int = None


class userIdModel(BaseModel):
    uid: str


class questionModel(BaseModel):
    title: str


class quizModel(BaseModel):
    title: str
    decription: str
    questions: List[questionModel]
    createdAt: datetime
    updatedAt: datetime


db = firestore.client()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def getApp():
    return app


@app.get("/v1/alive", status_code=status.HTTP_200_OK)
def alive():
    return {"hello": "JAMVA"}


@app.get("/v1/search")
def searchDiseaseReport(startDate, endDate, location, keyTerm=""):
    return search(db, startDate, endDate, location, keyTerm)


@app.post("/v1/users/create", status_code=status.HTTP_201_CREATED)
def createUser(user: userCreationModel):
    return createUserEntry(db, user)


@app.delete("/v1/users/delete/{uid}", status_code=status.HTTP_204_NO_CONTENT)
def deleteUser(uid: str):
    return deleteUserEntry(db, uid)


@app.get("/v1/users/details/{uid}", status_code=status.HTTP_200_OK)
def getUser(uid: str):
    return getUserDetail(db, uid)


# Disease endpoints
@app.get("/v1/diseases/search")
def fetchDiseaseName(disease):
    return fetchDiseaseByName(db, disease)


@app.get("/v1/diseases/search/location")
def fetchDiseaseLocation(location):
    return fetchDiseaseByLocation(db, location)


@app.get("/v1/diseaseData/global")
async def diseaseDataGlobal():
    return globalData(db)


@app.get("/v1/diseaseData/{countryId}")
async def diseaseDataGlobal(countryId):
    return countryData(db, countryId)


# Articles endpoints
@app.get("/v1/articles/latest")
def fetchlatestArt():
    return fetchlatestArticle(db)


@app.get("/v1/articles/search/id")
def fetchByIdArt(id):
    return fetchByIdArticle(db, id)


@app.get("/v1/articles/search/country")
def fetchByCou(country):
    return fetchByCountry(db, country)


@app.get("/v1/articles/search/disease")
def fetchByDis(disease):
    return fetchByDisease(db, disease)


@app.get("/v1/articles/search/date")
def fetchByDate(startDate, endDate=""):
    return fetchByDateArticle(db, startDate, endDate)


@app.post("/v1/quiz/")
def postNewQuiz(quizData: quizModel):
    print(quizData)
    return {}


# logger (keeps track of API performance) Runs for each request of the api
@app.middleware("http")
async def Logger(request: Request, call_next):

    # Track which endpoint this log is for
    parts = str(request.url)
    parts = parts.split("/")[3:]
    endpoint = "/" + "/".join(parts)

    # Tracks reponse time of request
    startTime = time.time()
    response = await call_next(request)
    endTime = time.time()

    # Track time of request
    requestTime = str(datetime.now())
    processTime = str(round((endTime - startTime), 4)) + "s"

    # Track Status of request
    status = str(response.status_code)

    # Track method used
    method = request.method

    # Track user ip
    ip = str(request.client.host)
    # ip = ipToLocation(request.client.host)

    # Track request packet body size (bytes)
    size = response.headers["content-length"]

    # write to backend log file
    logFile = open("./log.txt", "a")
    logEntry = (
        endpoint
        + " ["
        + method
        + ", "
        + status
        + ", "
        + ip
        + ", "
        + requestTime
        + ", "
        + processTime
        + ", "
        + size
        + "B]\n"
    )
    logFile.write(logEntry)

    # Return log info to user
    response.headers["Team-Name"] = "Jamva"
    response.headers["Accessed-Time"] = requestTime
    response.headers["Data-Source"] = "https://promedmail.org/"
    return response


# Used to find the location of ip address
# *Not Used for now as it slows down response time considerably
def ipToLocation(ip):
    # use a website to find the location of ip
    requestUrl = "https://geolocation-db.com/jsonp/" + ip
    try:
        response = requests.get(requestUrl)
    except:
        return "ip to location website is currently unavailable"

    # decode content
    result = response.content.decode()

    # remove uncessary infomation
    result = result.split("(")[1].strip(")")

    # Convert date into a json dictionary
    result = json.loads(result)

    return result["country_name"] + ", " + result["city"]
