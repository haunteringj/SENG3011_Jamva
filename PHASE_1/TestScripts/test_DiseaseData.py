from cmath import exp
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient
import json
from API_SourceCode.main import app
from API_SourceCode.diseaseData import globalData, countryData

client = TestClient(app)


def test_sanity():
    response = client.get("/v1/alive")
    assert response.status_code == 200


def test_global_ok():
    # This test uses a test piece of data, a country that has a 3 digit country code "AAA", meaning it should
    # Always come first in the list of countries for global. This also means that it cannot be modified by the scraper
    # because there are no other countries that have the code AAA. This means its response should be able to be predicted.
    response = client.get("/v1/diseaseData/global")
    assert response.status_code == 200
    dict_data = response.json()
    expected_country = [
  {
    "countryName": "testcountry",
    "id": "AAA",
    "articles": [
      {
        "country": " australia",
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "id": 952,
        "disease": "poliomyelitis ",
        "publishDate": "2022-03-09 13:00:00+00:00",
        "content": "yeah nah",
        "title": "Poliomyelitis update (10): Israel (JM) VDPV, RFI"
      }
    ],
    "outbreaks": [
      {
        "country": "AU",
        "disease": {
          "id": 8701648,
          "syndromes": [
            "Haemorrhagic Fever",
            "\"Acute Flacid Paralysis",
            "\"Acute gastroenteritis"
          ],
          "diseaseName": "Smallpox"
        },
        "date": "2022-03-13 20:00:00+00:00",
        "cases": 23
      }
    ]
  },
  {
    "outbreaks": [],
    "countryName": "australia",
    "id": "AU",
    "articles": [
      {
        "country": " australia",
        "id": 952,
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "disease": "poliomyelitis ",
        "content": "yeah nah",
        "publishDate": "2022-03-09 13:00:00+00:00",
        "title": "Poliomyelitis update (10): Israel (JM) VDPV, RFI"
      }
    ]
  }
]
    assert dict_data == expected_country


def test_global_bad_data():
    # This is hard to test by calling the endpoint. Instead I will just call the function with a bad database
    response = globalData(1)
    assert response.status_code == 500
    assert response.body == b'"Unable to fetch from database"'


def test_country_ok():
    # Similar to previous tests, we run under the assumption that AAA wont be modified.
    response = client.get("/v1/diseaseData/AAA")

    assert response.json() == {
    "id": "AAA",
    "countryName": "testcountry",
    "articles": [
        {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "id": 952,
        "disease": "poliomyelitis ",
        "publishDate": "2022-03-09 13:00:00+00:00",
        "country": " australia",
        "title": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "content": "yeah nah"
        }
    ],
    "outbreaks": [
        {
        "disease": {
            "id": 8701648,
            "diseaseName": "Smallpox",
            "syndromes": [
            "Haemorrhagic Fever",
            "\"Acute Flacid Paralysis",
            "\"Acute gastroenteritis"
            ]
        },
        "date": "2022-03-13 20:00:00+00:00",
        "cases": 23,
        "country": "AU"
        }
    ]
    }


def test_country_bad_country():
    # If the format of country code is incorrect, we return a 400 error. Note we use [A-Z]{2,3} in regex. Because this allows for AAA to still exist.
    # It also allows for 3 character country code if we would ever want them. It could have been more robust if we created a list of all of the possible
    # Country codes, but this will most likely be something that the frontend handles.
    response = client.get("/v1/diseaseData/123")
    assert response.status_code == 400
    assert (
        response.json()
        == "Countries are searched with an id (e.g AU). You entered:123"
    )


def test_country_no_country():
    # Typical functionality, if given a country id that doesnt exist, we will say that it doesnt.
    response = client.get("/v1/diseaseData/AWD")
    assert response.status_code == 404
    assert response.json() == "The country with id:AWD does not exist."


def test_country_bad_data():
    # This is hard to test by calling the endpoint. Instead I will just call the function with a bad database
    response = countryData(1, "AU")
    assert response.status_code == 500
    assert response.body == b'"Unable to fetch from database"'
