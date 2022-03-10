from fastapi import FastAPI
from articleEndPoints import *

app = FastAPI()

@app.get("/v1/alive")
def alive():
  return {"hello": "JAMVA"}

# Articles endpoints
@app.get("/articles/latest")
def fetchlatestArt():
  return fetchlatestArticle()

@app.get("/articles/search/id")
def fetchByIdArt(id):
  return fetchByIdArticle(id)

@app.get("/articles/search/country")
def fetchByCou(country):
  return fetchByCountry(country)

@app.get("/articles/search/disease")
def fetchByDis(disease):
  return fetchByDisease(disease)

@app.get("/articles/search/date")
def fetchByDate(startDate, endDate = ""):
  return fetchByDateArticle(startDate, endDate)
