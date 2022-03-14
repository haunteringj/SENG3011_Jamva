from fastapi import FastAPI, Request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import time
import datetime
  
# connect to database
cred = credentials.Certificate("../firebasePrivateKey.json")

try: 
  from diseaseData import globalData, countryData
except:
  from .diseaseData import globalData, countryData
try: 
  from articleEndPoints import *
except:
  from .articleEndPoints import *

# connect to database
cred = credentials.Certificate("../firebasePrivatekey.json")

firebase_admin.initialize_app(cred, {'projectId': "jamva-4e82e",})
db = firestore.client()

app = FastAPI()

@app.get("/v1/alive")
def alive():
  return {"hello": "JAMVA"}

# Disease endpoints
@app.get("/diseases/search")
def fetchDiseaseName(disease):
  return fetchDiseaseByName(db, disease)

@app.get("/diseases/search/outbreaks")
def fetchDiseaseLocation(location):
  return fetchDiseaseByLocation(db, location)

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

@app.get("/v1/alive")
async def alive():
    return {"hello": "JAMVA"}


@app.get("/diseaseData/global")
async def diseaseDataGlobal():
    return globalData(db)


@app.get("/diseaseData/{countryId}")
async def diseaseDataGlobal(countryId):
    return countryData(db, countryId)

# logger (keeps track of API performance) Runs for each request of the api
@app.middleware("http")
async def Logger(request: Request, call_next):
  # Track which endpoint this log is for
  parts = str(request.url)
  parts = parts.split('/')[3:]
  endpoint = "/" + '/'.join(parts)

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
  size = response.headers['content-length']
  
  logFile = open('./log.txt', 'a')
  logEntry = endpoint + " [" + method + ", " + status + ", " + ip + ", " + requestTime + ", " + processTime + ", " + size + "B]\n" 
  logFile.write(logEntry)
  return response


# Used to find the location of ip address 
# *Not Used for now as it slows down response time considerably
def ipToLocation(ip):
  # use a website to find the location of ip
  requestUrl = 'https://geolocation-db.com/jsonp/' + ip
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

  return result['country_name'] + ", " + result['city']
