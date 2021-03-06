from fastapi.testclient import TestClient
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
    expected_country = {
        "id": "AAA",
        "countryName": "testcountry",
        "articles": [
            {
                "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
                "date_of_publication": "2022-03-10 13:00:00+00:00",
                "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
                "main_text": "yeah nah Poliomyelitis",
                "reports": {
                    "diseases": ["poliomyelitis"],
                    "syndromes": ["fever", "high temp"],
                    "event_date": "2022-03-02 13:00:00+00:00",
                    "locations": ["testcountry", "australia"],
                },
            }
        ],
    }
    assert dict_data[0] == expected_country


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
                "date_of_publication": "2022-03-10 13:00:00+00:00",
                "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
                "main_text": "yeah nah Poliomyelitis",
                "reports": {
                    "diseases": ["poliomyelitis"],
                    "syndromes": ["fever", "high temp"],
                    "event_date": "2022-03-02 13:00:00+00:00",
                    "locations": ["testcountry", "australia"],
                },
            }
        ],
    }


def test_country_bad_country():
    # If the format of country code is incorrect, we return a 400 error. Note we use [A-Z]{2,3} in regex. Because this allows for AAA to still exist.
    # It also allows for 3 character country code if we would ever want them. It could have been more robust if we created a list of all of the possible
    # Country codes, but this will most likely be something that the frontend handles.
    response = client.get("/v1/diseaseData/123")
    assert response.status_code == 400
    assert (
        response.json() == "Countries are searched with an id (e.g AU). You entered:123"
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
