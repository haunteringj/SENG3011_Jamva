from datetime import datetime
from http.client import HTTPException
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from typing import Optional

# connect to database
try:
    cred = credentials.Certificate("./firebasePrivateKey.json")
    firebase_admin.initialize_app(cred, {'projectId': "jamva-4e82e",})
    db = firestore.client()
except:
    # TO FIX!!!!: "Not tested but pretty sure this doesn't work"
    raise HTTPException(status_code=500, detail= "Unable to fetch from database" )

# api
app = FastAPI()

# endpoints
@app.get("/articles/latest")
def fetchlatestArticle():
    # number of latest articles to be returned
    noOfArticles = 20
    query = db.collection("articles").order_by("publishDate", direction=firestore.Query.DESCENDING).limit(noOfArticles)
    articles = query.get()
    listOfArticles = []
    for x in articles:
        listOfArticles.append(x.to_dict())
    
    return JSONResponse(
        status_code=200,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(listOfArticles, default=str),
    )

@app.get("/articles/search/id")
def fetchByIdArticle(id):
    # check if id is an integer
    try:
        id = int(id)
    except:
        return JSONResponse(
            status_code=400,
            content={"message": "articles are searched with an article id (e.g 8701648). You entered:{}".format(id)},
        )
    # query data base
    query = db.collection('articles').where('id', '==', id).stream()
    try: 
        article = next(query).to_dict()
    except:
        return JSONResponse(
            status_code=404,
            content={"message": "no articles was found with that id. You entered:{}".format(id)},
        )

    # return the article
    return JSONResponse(
        status_code=200,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(article, default=str),
    )

@app.get("/articles/search/country")
def fetchByCountry(country):
    # check if country is an string
    try:
        country = str(country)
    except:
        return JSONResponse(
            status_code=400,
            content={"message": "articles are searched with a country name (e.g America). You entered:{}".format(country)},
        )
    
    # preprocessing to match country name
    countryProcessedName = country.lower()
    countryProcessedName = ''.join(country.split())

    # query data base
    query = db.collection('articles').where('country', '==', countryProcessedName)
    articles = query.get()
    listOfArticles = []
    for x in articles:
        listOfArticles.append(x.to_dict())
    if (listOfArticles == []):
        return JSONResponse(
            status_code=404,
            content={"message": "no articles was found with that country. You entered:{}".format(country)},
        )
    else:
        return JSONResponse(
            status_code=200,
            # "default=str" to convert datetimewithnanoseconds to string
            content=json.dumps(listOfArticles, default=str),
        )

@app.get("/articles/search/disease")
def fetchByDisease(disease):
    # check if disease is an string
    try:
        disease = str(disease)
    except:
        return JSONResponse(
            status_code=400,
            content={"message": "articles are searched with a disease name (e.g Covid 19). You entered:{}".format(disease)},
        )
    
    # preprocessing to match disease name
    diseaseProcessedName = disease.lower()

    # query data base
    query = db.collection('articles').where('disease', '==', diseaseProcessedName)
    articles = query.get()
    listOfArticles = []
    for x in articles:
        listOfArticles.append(x.to_dict())
    
    if (listOfArticles == []):
        return JSONResponse(
            status_code=404,
            content={"message": "no articles was found with that disease. You entered:{}".format(disease)},
        )
    else:
        return JSONResponse(
            status_code=200,
            # "default=str" to convert datetimewithnanoseconds to string
            content=json.dumps(listOfArticles, default=str),
        )

@app.get("/articles/search/date")
def fetchByDateArticle(startDate, endDate = ""):
    # convert start date from string to datetime
    try: 
        start = datetime.strptime(startDate,'%Y/%m/%d')
    except:
        return JSONResponse(
            status_code=400,
            # "default=str" to convert datetimewithnanoseconds to string
            content=json.dumps("Correct date format (yyyy/mm/dd).You entered:{}".format(startDate), default=str),
        )
    
    # convert end date from string to datetime
    if (endDate != ""):
        try: 
            end = datetime.strptime(endDate,'%Y/%m/%d')
        except:
            return JSONResponse(
            status_code=400,
            # "default=str" to convert datetimewithnanoseconds to string
           content=json.dumps("Correct date format (yyyy/mm/dd).You entered:{}".format(endDate), default=str),
        )

        # return a list of articles inbetween the start and end dates (inclusive)
        # query data base
        query = db.collection('articles').where('publishDate', '>=', start).where('publishDate', '<=', end)
        articles = query.get()
        listOfArticles = []
        for x in articles:
            listOfArticles.append(x.to_dict())

        if (listOfArticles == []):
            return JSONResponse(
                status_code=404,
                content=json.dumps("Correct date format (yyyy/mm/dd).You entered:{} to {}".format(startDate, endDate), default=str),
            )
        else:
            return JSONResponse(
                status_code=200,
                # "default=str" to convert datetimewithnanoseconds to string
                content=json.dumps(listOfArticles, default=str),
            )
    else:
        # return a list of articles after the start date (inclusive)
        # query data base
        query = db.collection('articles').where('publishDate', '>=', start)
        articles = query.get()
        listOfArticles = []
        for x in articles:
            listOfArticles.append(x.to_dict())

        if (listOfArticles == []):
            return JSONResponse(
                status_code=404,
                content=json.dumps("no articles were found with your specified date(s). You entered:{}".format(startDate), default=str),
            )
        else:
            return JSONResponse(
                status_code=200,
                # "default=str" to convert datetimewithnanoseconds to string
                content=json.dumps(listOfArticles, default=str),
            )


