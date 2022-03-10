from datetime import datetime
from http.client import HTTPException
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

# connect to database
cred = credentials.Certificate("./firebasePrivateKey.json")
firebase_admin.initialize_app(cred, {'projectId': "jamva-4e82e",})
db = firestore.client()

# Reorders the queryresults to have a consistent format
def reorderFields(queryResult):
    orderOfFields = ["id", "title", "publishDate", "disease", "country", "content"]
    return {k: queryResult.to_dict()[k] for k in orderOfFields}

# form list of Articles from a query get result
def formListOfArticles(queryGetResult):
    listOfArticles = []
    for queryResult in queryGetResult:
        listOfArticles.append(reorderFields(queryResult))
    return listOfArticles

# returns a json response 
def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(content, default=str),
    )

# Endpoints
def fetchlatestArticle():
    # number of latest articles to be returned
    noOfArticles = 20

    # query database
    try:
        query = db.collection("articles").order_by("publishDate", direction=firestore.Query.DESCENDING).limit(noOfArticles).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    listOfArticles = formListOfArticles(query)
    if (listOfArticles == []):
        return toJsonResponse(500, "Our database is empty :O Very Odd please contant development")
    else:
        return toJsonResponse(200, formListOfArticles(query))

def fetchByIdArticle(id):
    # check if id is an integer
    try:
        id = int(id)
    except:
        return toJsonResponse(400, "articles are searched with an article id (e.g 8701648). You entered:{}".format(id))
    
    # query data base
    query = db.collection('articles').where('id', '==', id).stream()
    try: 
        article = reorderFields(next(query))
    except:
        return toJsonResponse(404,"no articles was found with that id. You entered:{}".format(id))

    # return the article
    return toJsonResponse(200, article)

def fetchByCountry(country):
    # check if country is an string
    try:
        country = str(country)
    except:
        return toJsonResponse(400, "articles are searched with a country name (e.g America). You entered:{}".format(country))
    
    # preprocessing to match country name
    countryProcessedName = country.lower()
    countryProcessedName = ''.join(country.split())

    # query data base
    query = db.collection('articles').where('country', '==', countryProcessedName).get()
    listOfArticles = formListOfArticles(query)
    if (listOfArticles == []):
        return toJsonResponse(404, "no articles was found with that country. You entered:{}".format(country))
    else:
        return toJsonResponse (200, listOfArticles)

def fetchByDisease(disease):
    # check if disease is an string
    try:
        disease = str(disease)
    except:
        return toJsonResponse (400, "articles are searched with a disease name (e.g Covid 19). You entered:{}".format(disease))
    
    # preprocessing to match disease name
    diseaseProcessedName = disease.lower()

    # query data base
    query = db.collection('articles').where('disease', '==', diseaseProcessedName).get()
    listOfArticles = formListOfArticles(query)
    
    if (listOfArticles == []):
        return toJsonResponse (404, "no articles was found with that disease. You entered:{}".format(disease))
    else:
        return toJsonResponse(200, listOfArticles)

def fetchByDateArticle(startDate, endDate = ""):
    # convert start date from string to datetime
    try: 
        start = datetime.strptime(startDate,'%Y/%m/%d')
    except:
        return toJsonResponse(400, "Correct date format (yyyy/mm/dd).You entered:{}".format(startDate))
    
    # convert end date from string to datetime
    if (endDate != ""):
        try: 
            end = datetime.strptime(endDate,'%Y/%m/%d')
        except:
            return toJsonResponse(400, "Correct date format (yyyy/mm/dd).You entered:{}".format(endDate))

        # return a list of articles inbetween the start and end dates (inclusive)
        # query data base
        query = db.collection('articles').where('publishDate', '>=', start).where('publishDate', '<=', end).get()
        listOfArticles = formListOfArticles(query)

        if (listOfArticles == []):
            return toJsonResponse(404, "Correct date format (yyyy/mm/dd).You entered:{} to {}".format(startDate, endDate))
        else:
            return toJsonResponse(200, listOfArticles)
    else:
        # return a list of articles after the start date (inclusive)
        # query data base
        query = db.collection('articles').where('publishDate', '>=', start).get()
        listOfArticles = formListOfArticles(query)

        if (listOfArticles == []):
            return toJsonResponse(404, "no articles were found with your specified date(s). You entered:{}".format(startDate))
        else:
            return toJsonResponse(200, listOfArticles)

