from API_SourceCode import app
from datetime import datetime
from fastapi.testclient import TestClient
from firebase_admin import firestore
import json
try:
    from API_SourceCode.diseasesEndpoints import *
except:
    from API_SourceCode.diseasesEndpoints import *

client = TestClient(app)

# connect to database
db = firestore.client()

# Tests
def test_is_alive():
    response = client.get("/v1/alive")
    assert response.status_code == 200
    assert response.json() == {"hello": "JAMVA"}

def test_search_success():
    response = client.get("/diseases/search?disease=Smallpox")
    assert response.status_code == 200
        
def test_search_false_input():
    response = client.get("/diseases/search?disease=123")
    assert response.status_code == 400
    assert response.json() == '"diseases are searched with a disease name (e.g Smallpox). You entered:123"'

def test_search_no_disease():
    response = client.get("/diseases/search?disease=fabio")
    assert response.status_code == 404
    assert response.json() == '"no diseases was found with that name. You entered:fabio"'
    
def test_search_failure():
    response = fetchDiseaseByName(1, "banana")
    assert response.status_code == 500
    #assert response.json() == "Unable to fetch from database"
    

def test_search_outbreaks_success():
    response = client.get("/diseases/search/outbreaks?location=AU")
    assert response.status_code == 200
    #assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_search_outbreaks_false_input():
    response = client.get("/diseases/search/outbreaks?location=123")
    assert response.status_code == 400
    assert response.json() == '"diseases are searched with a country code (e.g AU). You entered:123"'
    
def test_search_outbreaks_no_location():
    response = client.get("/diseases/search/outbreaks?location=fabio")
    assert response.status_code == 404
    assert response.json() == '"no diseases was found in that location. You entered:fabio"'
        
def test_search_outbreaks_failure():
    response = fetchDiseaseByLocation(1, "banana")
    assert response.status_code == 500
    #assert response.json() == "Unable to fetch from database"
    
