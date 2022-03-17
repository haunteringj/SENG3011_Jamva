from asyncio.windows_events import NULL
from datetime import datetime
from fastapi.responses import JSONResponse

try:
    from articleEndPoints import dereferenceReports
except:
    from .articleEndPoints import dereferenceReports
import json
import re

# returns a json response
def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.loads(json.dumps(content, default=str)),
    )


def formListOfCountries(query):
    listofCountries = []
    for result in query:
        country = result.to_dict()
        country["articles"] = formListOfArticles(country)
        listofCountries.append(reOrderCountry(country))
    return listofCountries


def reOrderCountry(country):
    orderOfFields = ["id", "countryName", "articles"]
    return {k: country[k] for k in orderOfFields}


def formListOfArticles(country):
    listOfArticles = []
    for article in country["articles"]:
        listOfArticles.append(reOrderArticle(article.get().to_dict()))
    return listOfArticles


def reOrderArticle(article):
    orderOfFields = ["url", "date_of_publication", "headline", "main_text", "reports"]
    orderDict = {}
    for k in orderOfFields:
        # Deference disease to get content of linked disease
        if k == "reports":
            listOfReports = []
            for report in article[k]:
                orderDict[k] = dereferenceReports(report.get().to_dict())
        else:
            orderDict[k] = article[k]
    return orderDict


def reOrderOutbreak(outbreak):
    orderOfFields = ["cases", "country", "date", "disease"]
    return {k: outbreak[k] for k in orderOfFields}


def reOrderDisease(disease):
    orderOfFields = ["id", "diseaseName", "syndromes"]
    return {k: disease[k] for k in orderOfFields}


# Endpoints
def globalData(db):
    print("HERE")
    try:
        query = db.collection("countries").get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    try:
        listofCountries = formListOfCountries(query)
    except Exception as e:
        return toJsonResponse(500, f"Error in processing data. {e}")
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

    return toJsonResponse(200, country)
