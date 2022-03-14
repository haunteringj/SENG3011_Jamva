from API_SourceCode import app
from datetime import datetime
from fastapi.testclient import TestClient
from firebase_admin import firestore
import json

client = TestClient(app)

# connect to database
db = firestore.client()

# Tests
def test_is_alive():
    response = client.get("/v1/alive")
    assert response.status_code == 200
    assert response.json() == {"hello": "JAMVA"}

def test_search_success():
    response = client.get("/diseases/search")
    assert response.status_code == 200
    #assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_search_false_input():
    response = client.get("/diseases/search?search="123")
    assert response.status_code == 400
    assert response.json() == '"diseases are searched with a disease name (e.g Smallpox). You entered:123"'

def test_search_no_disease():
    response = client.get("/diseases/search?search="fabio")
    assert response.status_code == 404
    assert response.json() == '"no diseases was found with that id. You entered:fabio"'
    
def test_search_failure():
    #pssh
    
def test_search_outbreaks_success():
    response = client.get("/diseases/search/outbreaks?outbreaks="AU")
    assert response.status_code == 200
    #assert response.json() == json.dumps(listOfArticles, default=str)
    
def test_search_outbreaks_false_input():
    response = client.get("/diseases/search/outbreaks?outbreaks="123")
    assert response.status_code == 400
    assert response.json() == '"diseases are searched with a disease location (e.g "australia"). You entered:123"'
    
def test_search_outbreaks_no_location():
    response = client.get("/diseases/search/outbreaks?outbreaks="fabio")
    assert response.status_code == 404
    assert response.json() == '"no diseases was found with that id. You entered:fabio"'
        
def test_search_outbreaks_failure():
    #psssh