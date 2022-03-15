from API_SourceCode import app
from datetime import datetime
from fastapi.testclient import TestClient
from firebase_admin import firestore
import json

client = TestClient(app)

# connect to database
db = firestore.client()

# Helper functions
# Reorders the queryresults to have a consistent format
def reorderFields(queryResult):
    orderOfFields = ["id", "title", "publishDate", "disease", "country", "url", "content"]
    return {k: queryResult.to_dict()[k] for k in orderOfFields}

# form list of Articles from a query get result
def formListOfArticles(queryGetResult):
    listOfArticles = []
    for queryResult in queryGetResult:
        listOfArticles.append(reorderFields(queryResult))
    return listOfArticles

# Tests
def test_is_alive():
    response = client.get("/v1/alive")
    assert response.status_code == 200
    assert response.json() == {"hello": "JAMVA"}

def test_article_latest():
    response = client.get("/v1/articles/latest")
    assert response.status_code == 200
    noOfArticles = 20
    query = db.collection("articles").order_by("publishDate", direction=firestore.Query.DESCENDING).limit(noOfArticles).get()
    listOfArticles = formListOfArticles(query)
    assert response.json() == json.dumps(listOfArticles, default=str)

def test_article_id_success():
    response = client.get("/v1/articles/search/id?id=123")
    assert response.status_code == 200
    query = db.collection('articles').where('id', '==', 123).stream()
    article = reorderFields(next(query))
    assert response.json() == json.dumps(article, default=str)

def test_article_id_no_such_article():
    response = client.get("/v1/articles/search/id?id=13")
    assert response.status_code == 404
    assert response.json() == '"no articles was found with that id. You entered:13"'

def test_article_id_incorrect_query():
    response = client.get("/v1/articles/search/id?id=a")
    assert response.status_code == 400
    assert response.json() == '"articles are searched with an article id (e.g 8701648). You entered:a"'


def test_article_country_success():
    response = client.get("/v1/articles/search/country?country=Chin a")
    assert response.status_code == 200
    query = db.collection('articles').where('country', '==', "china").get()
    listOfArticles = formListOfArticles(query)
    assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_article_country_no_such_article():
    response = client.get("/v1/articles/search/country?country=moon")
    assert response.status_code == 404
    assert response.json() == '"no articles was found with that country. You entered:moon"'


def test_article_disease_success():
    response = client.get("/v1/articles/search/disease?disease=Covid 19")
    assert response.status_code == 200
    query = db.collection('articles').where('disease', '==', "covid 19").get()
    listOfArticles = formListOfArticles(query)
    assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_article_disease_no_such_article():
    response = client.get("/v1/articles/search/disease?disease=Cough")
    assert response.status_code == 404
    assert response.json() == '"no articles was found with that disease. You entered:Cough"'


def test_article_date_success_start():
    response = client.get("/v1/articles/search/date?startDate=2022-3-9T00:00:00")
    assert response.status_code == 200
    start = datetime.strptime("2022-3-9T00:00:00","%Y-%m-%dT%H:%M:%S")
    query = db.collection('articles').where('publishDate', '>=', start).get()
    listOfArticles = formListOfArticles(query)
    assert response.json() == json.dumps(listOfArticles, default=str)

def test_article_date_success_start_and_end():
    response = client.get("/v1/articles/search/date?startDate=2022-3-9T00:00:00&endDate=2022-3-12T00:00:00")
    assert response.status_code == 200
    start = datetime.strptime("2022-3-9T00:00:00","%Y-%m-%dT%H:%M:%S")
    end = datetime.strptime("2022-3-12T00:00:00","%Y-%m-%dT%H:%M:%S")
    query = db.collection('articles').where('publishDate', '>=', start).where('publishDate', '<=', end).get()
    listOfArticles = formListOfArticles(query)
    assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_article_date_no_such_article():
    response = client.get("/v1/articles/search/date?startDate=2029-3-9T00:00:00")
    assert response.status_code == 404
    assert response.json() == '"no articles were found with your specified date(s). You entered:2029-3-9T00:00:00"'

def test_article_date_incorrect_start():
    response = client.get("/v1/articles/search/date?startDate=2/3/2009")
    assert response.status_code == 400
    assert response.json() == '"Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:2/3/2009"'

def test_article_date_incorrect_end():
    response = client.get("/v1/articles/search/date?startDate=2022/3/12&endDate=13/3/2022")
    assert response.status_code == 400
    assert response.json() == '"Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:2022/3/12 to 13/3/2022"'

def test_article_date_incorrect_start_and_end():
    response = client.get("/v1/articles/search/date?startDate=9/3/2022&endDate=13/3/2022")
    assert response.status_code == 400
    assert response.json() == '"Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:9/3/2022 to 13/3/2022"'

def test_article_date_backward_range():
    response = client.get("/v1/articles/search/date?startDate=2022-3-12T00:00:00&endDate=2022-3-9T00:00:00")
    assert response.status_code == 404
    assert response.json() == '"no articles were found with your specified date(s). You entered:2022-3-12T00:00:00 to 2022-3-9T00:00:00"'
