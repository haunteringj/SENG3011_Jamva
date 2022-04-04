from API_SourceCode import app
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
    response = client.get("/v1/diseases/search?disease=fakediseasetest")
    assert response.status_code == 200
    assert response.json() == {
        "syndromes": [
            "Haemorrhagic Fever",
            "Acute Flacid Paralysis"
        ],
        "diseaseName": "fakediseasetest",
        "id": 123124,
        "reports": []
    }


def test_search_false_input():
    response = client.get("/v1/diseases/search?disease=123")
    assert response.status_code == 400
    assert (
        response.json()
        == "diseases are searched with a disease name (e.g Smallpox). You entered:123"
    )


def test_search_no_disease():
    response = client.get("/v1/diseases/search?disease=fabio")
    assert response.status_code == 404
    assert response.json() == "no diseases was found with that name. You entered:fabio"


def test_search_failure():
    response = fetchDiseaseByName(1, "banana")
    assert response.status_code == 500


def test_search_location_success():
    response = client.get("/v1/diseases/searchs/AAA")
    assert response.json() == [
  {
    "cases": 23,
    "article": {
      "id": 8701648,
      "url": "http://english.news.cn/europe/20220312/2be89619e7a24eceb1413aeb5489368b/c.html",
      "main_text": "Bird flu is spreading in Iowa, with the AVIAN INFLUENZA...",
      "headline": "AVIAN INFLUENZA (62): AMERICAS (USA) POULTRY",
      "date_of_publication": "2022-03-08T03:16:48"
    },
    "locations": [
      {
        "countryName": "testcountry",
        "id": "AAA"
      }
    ],
    "event_date": "2022-03-01T13:00:00"
  },
  {
    "cases": 42,
    "event_date": "2022-03-06T13:00:00",
    "article": {
      "main_text": "yeah nah it's covid-19 ya",
      "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
      "id": 123,
      "url": "https://promedmail.org/",
      "date_of_publication": "2022-03-08T13:00:00"
    },
    "locations": [
      {
        "id": "AU",
        "countryName": "australia",
        "users": []
      },
      {
        "countryName": "testcountry",
        "id": "AAA"
      }
    ]
  },
  {
    "locations": [
      {
        "countryName": "testcountry",
        "id": "AAA"
      },
      {
        "countryName": "australia",
        "users": [],
        "id": "AU"
      }
    ],
    "cases": 43,
    "article": {
      "date_of_publication": "2022-03-10T13:00:00",
      "main_text": "yeah nah Poliomyelitis",
      "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
      "id": 952,
      "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI"
    },
    "event_date": "2022-03-02T13:00:00"
  }
]


def test_search_outbreaks_false_input():
    response = client.get("/v1/diseases/searchs/123")
    assert response.status_code == 400
    assert (
        response.json()
        == "diseases are searched with a country code (e.g AU). You entered:123"
    )


def test_search_outbreaks_no_location():
    response = client.get("/v1/diseases/searchs/fabio")
    assert response.status_code == 404
    assert (
        response.json() == "no diseases was found in that location. You entered:fabio"
    )


def test_search_outbreaks_failure():
    response = fetchDiseaseByLocation(1, "banana")
    assert response.status_code == 500
