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
    response = client.get("/v1/diseases/search?disease=Smallpox")
    assert response.status_code == 200
    assert response.json() == {
    "id": 8701648,
    "syndromes": [
        "Haemorrhagic Fever",
        "Acute Flacid Paralysis",
        "Acute gastroenteritis"
    ],
    "diseaseName": "smallpox",
    "outbreaks": [
        {
        "cases": 23,
        "date": "2022-03-13 20:00:00+00:00",
        "country": "AU"
        }
    ]
    }
        
def test_search_false_input():
    response = client.get("/v1/diseases/search?disease=123")
    assert response.status_code == 400
    assert response.json() == "diseases are searched with a disease name (e.g Smallpox). You entered:123"

def test_search_no_disease():
    response = client.get("/v1/diseases/search?disease=fabio")
    assert response.status_code == 404
    assert response.json() == "no diseases was found with that name. You entered:fabio"
    
def test_search_failure():
    response = fetchDiseaseByName(1, "banana")
    assert response.status_code == 500
    

def test_search_outbreaks_success():
    response = client.get("/v1/diseases/search/outbreaks?location=AU")
    assert response.status_code == 200
    #assert json.loads(response.json()) == {'date': DatetimeWithNanoseconds(2022, 3, 13, 20, 0, tzinfo=datetime.timezone.utc), 'cases': 23, 'disease': {'diseaseName': 'Smallpox', 'id': 8701648, 'syndromes': ['Haemorrhagic Fever', '"Acute Flacid Paralysis', '"Acute gastroenteritis']}, 'country': 'AU'}    

def test_search_outbreaks_false_input():
    response = client.get("/v1/diseases/search/outbreaks?location=123")
    assert response.status_code == 400
    assert response.json() == "diseases are searched with a country code (e.g AU). You entered:123"
    
def test_search_outbreaks_no_location():
    response = client.get("/v1/diseases/search/outbreaks?location=fabio")
    assert response.status_code == 404
    assert response.json() == "no diseases was found in that location. You entered:fabio"
        
def test_search_outbreaks_failure():
    response = fetchDiseaseByLocation(1, "banana")
    assert response.status_code == 500
    
