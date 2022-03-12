from datetime import datetime
from fastapi.responses import JSONResponse
from firebase_admin import firestore
import json
import re

# returns a json response
def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(content, default=str),
    )


def formListOfCountries(query):
    listofCountries = []
    for result in query:
        country = result.to_dict()
        country["articles"] = formListOfArticles(country)
        country["diseases"] = formListOfDiseases(country)
        listofCountries.append(country)
    return listofCountries


def formListOfArticles(country):
    listOfArticles = []
    for article in country["articles"]:
        listOfArticles.append(article.get().to_dict())
    return listOfArticles


def formListOfDiseases(country):
    listOfDiseases = []
    for disease in country["diseases"]:
        listOfDiseases.append(disease.get().to_dict())
    return listOfDiseases


def globalData(db):

    try:
        query = db.collection("countries").get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    listofCountries = formListOfCountries(query)
    if listofCountries == []:
        return toJsonResponse(
            500, "Our database is empty :O Very Odd please contact development"
        )
    else:
        return toJsonResponse(200, listofCountries)


def countryData(db, countryId):
    if not re.search("[A-Z]{2,3}", countryId):
        return toJsonResponse(
            400, f"Countries are searched with an id (e.g AU). You entered:{countryId}"
        )
    try:
        query = db.collection("countries").where("id", "==", countryId)

    except:
        return toJsonResponse(500, "Unable to fetch from database")
    if query.get() == []:
        return toJsonResponse(404, f"The country with id:{countryId} does not exist.")
    country = query.get()[0].to_dict()
    country["articles"] = formListOfArticles(country)
    country["diseases"] = formListOfDiseases(country)

    return toJsonResponse(200, country)
