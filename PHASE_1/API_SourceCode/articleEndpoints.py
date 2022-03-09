from ast import Str
from datetime import datetime
from http.client import HTTPException
from fastapi import FastAPI

app = FastAPI()

@app.get("/articles/{id}")
def fetchByIdArticle(id: int):
    article = searchDB(id)
    return article

@app.get("/articles/latest")
def fetchByIdArticle():
    noOfArticles = 20
    article = searchDB(noOfArticles)
    return article

@app.get("/articles/search/country")
def fetchByCountry(country: Str = ""):
    # convert start date from string to datetime
    articles = searchDB(country)
    return articles

@app.get("/articles/search/disease")
def fetchByDisease(disease: Str = ""):
    # convert start date from string to datetime
    articles = searchDB(disease)
    return articles

@app.get("/articles/search/date")
def fetchByDateArticle(startDate: Str = "", endDate: Str = ""):
    # convert start date from string to datetime
    try: 
        start = datetime.strptime(startDate,'%Y-%m-%d %H:%M:%S')
    except:
        raise HTTPException(status_code=400, detail= "Correct start date format (yyyy/mm/dd).You entered:{}".format(startDate))
    
    # convert end date from string to datetime
    if (endDate != ""):
        try: 
            end = datetime.strptime(startDate,'%Y-%m-%d %H:%M:%S')
        except:
            raise HTTPException(status_code=400, detail= "Correct start date format (yyyy/mm/dd).You entered:{}".format(startDate))

        # return a list of articles inbetween the start and end dates (inclusive)
        articles = searchDB(start, end)
    else:
        # return a list of articles after the start date (inclusive)
        articles = searchDB(start)


