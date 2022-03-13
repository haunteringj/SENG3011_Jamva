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
    orderOfFields = ["id", "title", "publishDate", "disease", "country", "content"]
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

