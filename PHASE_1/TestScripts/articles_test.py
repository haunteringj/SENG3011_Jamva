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

def test_article_latest():
    response = client.get("/v1/articles/latest")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "date_of_publication": "2022-03-10 13:00:00+00:00",
        "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "main_text": "yeah nah Poliomyelitis",
        "reports": {
        "diseases": [
            "poliomyelitis"
        ],
        "syndromes": [
            "fever",
            "high temp"
        ],
        "event_date": "2022-03-02 13:00:00+00:00",
        "locations": [
            "testcountry",
            "australia"
        ]
        }
    },
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    },
    {
        "url": "http://english.news.cn/europe/20220312/2be89619e7a24eceb1413aeb5489368b/c.html",
        "date_of_publication": "2022-03-08 03:16:48+00:00",
        "headline": "AVIAN INFLUENZA (62): AMERICAS (USA) POULTRY",
        "main_text": "Bird flu is spreading in Iowa, with the AVIAN INFLUENZA...",
        "reports": {
        "diseases": [
            "Avian Influenza"
        ],
        "syndromes": [
            "fever",
            "head ache"
        ],
        "event_date": "2022-03-01 13:00:00+00:00",
        "locations": [
            "testcountry"
        ]
        }
    }
]

def test_article_id_success():
    response = client.get("/v1/articles/search/id?id=123")
    assert response.status_code == 200
    assert response.json() == {
    "url": "https://promedmail.org/",
    "date_of_publication": "2022-03-08 13:00:00+00:00",
    "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
    "main_text": "yeah nah it's covid-19 ya",
    "reports": {
        "diseases": [
        "COVID-19"
        ],
        "syndromes": [
        "coughs",
        "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
        "australia",
        "testcountry"
        ]
    }
    }

def test_article_id_no_such_article():
    response = client.get("/v1/articles/search/id?id=13")
    assert response.status_code == 404
    assert response.json() == "no articles was found with that id. You entered:13"

def test_article_id_incorrect_query():
    response = client.get("/v1/articles/search/id?id=a")
    assert response.status_code == 400
    assert response.json() == "articles are searched with an article id (e.g 8701648). You entered:a"


def test_article_country_success():
    response = client.get("/v1/articles/search/country?country=Australia")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    },
    {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "date_of_publication": "2022-03-10 13:00:00+00:00",
        "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "main_text": "yeah nah Poliomyelitis",
        "reports": {
        "diseases": [
            "poliomyelitis"
        ],
        "syndromes": [
            "fever",
            "high temp"
        ],
        "event_date": "2022-03-02 13:00:00+00:00",
        "locations": [
            "testcountry",
            "australia"
        ]
        }
    }
    ]
    
def test_article_country_no_such_article():
    response = client.get("/v1/articles/search/country?country=moon")
    assert response.status_code == 404
    assert response.json() == "no articles was found with that country. You entered:moon"


def test_article_disease_success():
    response = client.get("/v1/articles/search/disease?disease=Covid-19")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    }
    ]
    
def test_article_disease_no_such_article():
    response = client.get("/v1/articles/search/disease?disease=Cough")
    assert response.status_code == 404
    assert response.json() == "no articles was found with that disease. You entered:Cough"


def test_article_date_success_start():
    response = client.get("/v1/articles/search/date?startDate=2022-3-8T00:00:00")
    assert response.status_code == 200
    assert response.json() == [
  {
    "url": "http://english.news.cn/europe/20220312/2be89619e7a24eceb1413aeb5489368b/c.html",
    "date_of_publication": "2022-03-08 03:16:48+00:00",
    "headline": "AVIAN INFLUENZA (62): AMERICAS (USA) POULTRY",
    "main_text": "Bird flu is spreading in Iowa, with the AVIAN INFLUENZA...",
    "reports": {
      "diseases": [
        "Avian Influenza"
      ],
      "syndromes": [
        "fever",
        "head ache"
      ],
      "event_date": "2022-03-01 13:00:00+00:00",
      "locations": [
        "testcountry"
      ]
    }
  },
  {
    "url": "https://promedmail.org/",
    "date_of_publication": "2022-03-08 13:00:00+00:00",
    "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
    "main_text": "yeah nah it's covid-19 ya",
    "reports": {
      "diseases": [
        "COVID-19"
      ],
      "syndromes": [
        "coughs",
        "fever"
      ],
      "event_date": "2022-03-06 13:00:00+00:00",
      "locations": [
        "australia",
        "testcountry"
      ]
    }
  },
  {
    "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
    "date_of_publication": "2022-03-10 13:00:00+00:00",
    "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
    "main_text": "yeah nah Poliomyelitis",
    "reports": {
      "diseases": [
        "poliomyelitis"
      ],
      "syndromes": [
        "fever",
        "high temp"
      ],
      "event_date": "2022-03-02 13:00:00+00:00",
      "locations": [
        "testcountry",
        "australia"
      ]
    }
  }
]

def test_article_date_success_start_and_end():
    response = client.get("/v1/articles/search/date?startDate=2022-3-8T00:00:00&endDate=2022-3-9T00:00:00")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "http://english.news.cn/europe/20220312/2be89619e7a24eceb1413aeb5489368b/c.html",
        "date_of_publication": "2022-03-08 03:16:48+00:00",
        "headline": "AVIAN INFLUENZA (62): AMERICAS (USA) POULTRY",
        "main_text": "Bird flu is spreading in Iowa, with the AVIAN INFLUENZA...",
        "reports": {
        "diseases": [
            "Avian Influenza"
        ],
        "syndromes": [
            "fever",
            "head ache"
        ],
        "event_date": "2022-03-01 13:00:00+00:00",
        "locations": [
            "testcountry"
        ]
        }
    },
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    }
    ]
    
def test_article_date_no_such_article():
    response = client.get("/v1/articles/search/date?startDate=2029-3-9T00:00:00")
    assert response.status_code == 404
    assert response.json() == "no articles were found with your specified date(s). You entered:2029-3-9T00:00:00"

def test_article_date_incorrect_start():
    response = client.get("/v1/articles/search/date?startDate=2/3/2009")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:2/3/2009"

def test_article_date_incorrect_end():
    response = client.get("/v1/articles/search/date?startDate=2022/3/12&endDate=13/3/2022")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:2022/3/12 to 13/3/2022"

def test_article_date_incorrect_start_and_end():
    response = client.get("/v1/articles/search/date?startDate=9/3/2022&endDate=13/3/2022")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:9/3/2022 to 13/3/2022"

def test_article_date_backward_range():
    response = client.get("/v1/articles/search/date?startDate=2022-3-12T00:00:00&endDate=2022-3-9T00:00:00")
    assert response.status_code == 404
    assert response.json() == "no articles were found with your specified date(s). You entered:2022-3-12T00:00:00 to 2022-3-9T00:00:00"

def test_search_no_keyterms():
    response = client.get("/v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=Australia")
    # assert response.status_code == 200
    assert response.json() == [
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    },
    {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "date_of_publication": "2022-03-10 13:00:00+00:00",
        "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "main_text": "yeah nah Poliomyelitis",
        "reports": {
        "diseases": [
            "poliomyelitis"
        ],
        "syndromes": [
            "fever",
            "high temp"
        ],
        "event_date": "2022-03-02 13:00:00+00:00",
        "locations": [
            "testcountry",
            "australia"
        ]
        }
    }
    ]

def test_search_no_matching_keyterms():
    response = client.get("v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=Australia&keyTerm=HappyFeet")
    assert response.status_code == 404
    assert response.json() == "no articles were found"

def test_search_one_keyterms():
    response = client.get("/v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=Australia&keyTerm=yeah%20")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    },
    {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "date_of_publication": "2022-03-10 13:00:00+00:00",
        "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "main_text": "yeah nah Poliomyelitis",
        "reports": {
        "diseases": [
            "poliomyelitis"
        ],
        "syndromes": [
            "fever",
            "high temp"
        ],
        "event_date": "2022-03-02 13:00:00+00:00",
        "locations": [
            "testcountry",
            "australia"
        ]
        }
    }
    ] 

def test_search_multiple_keyterms():
    response = client.get("/v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=testcountry&keyTerm=yeah%2C%20flu")
    assert response.status_code == 200
    assert response.json() == [
    {
        "url": "http://english.news.cn/europe/20220312/2be89619e7a24eceb1413aeb5489368b/c.html",
        "date_of_publication": "2022-03-08 03:16:48+00:00",
        "headline": "AVIAN INFLUENZA (62): AMERICAS (USA) POULTRY",
        "main_text": "Bird flu is spreading in Iowa, with the AVIAN INFLUENZA...",
        "reports": {
        "diseases": [
            "Avian Influenza"
        ],
        "syndromes": [
            "fever",
            "head ache"
        ],
        "event_date": "2022-03-01 13:00:00+00:00",
        "locations": [
            "testcountry"
        ]
        }
    },
    {
        "url": "https://promedmail.org/",
        "date_of_publication": "2022-03-08 13:00:00+00:00",
        "headline": " COVID-19 update (67): Hong Kong, China, new normal, social determ. health, WHO",
        "main_text": "yeah nah it's covid-19 ya",
        "reports": {
        "diseases": [
            "COVID-19"
        ],
        "syndromes": [
            "coughs",
            "fever"
        ],
        "event_date": "2022-03-06 13:00:00+00:00",
        "locations": [
            "australia",
            "testcountry"
        ]
        }
    },
    {
        "url": "https://www.foodsafetynews.com/2022/03/cheese-recalled-because-of-link-to-listeria-infections/",
        "date_of_publication": "2022-03-10 13:00:00+00:00",
        "headline": "Poliomyelitis update (10): Israel (JM) VDPV, RFI",
        "main_text": "yeah nah Poliomyelitis",
        "reports": {
        "diseases": [
            "poliomyelitis"
        ],
        "syndromes": [
            "fever",
            "high temp"
        ],
        "event_date": "2022-03-02 13:00:00+00:00",
        "locations": [
            "testcountry",
            "australia"
        ]
        }
    }
    ]

def test_search_no_matching_location():
    response = client.get("/v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=testcountry&keyTerm=c-137")
    assert response.status_code == 404
    assert response.json() == "no articles were found"

def test_search_incorrect_start_date():
    response = client.get("/v1/search?startDate=2022-3-7%2000%3A00%3A00&endDate=2022-3-19T00%3A00%3A00&location=testcountry")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss) *can use 'x' for filler but year can't be filler. You entered:2022-3-7 00:00:00 to 2022-3-19T00:00:00"

def test_search_incorrect_end_date():
    response = client.get("/v1/search?startDate=2022-3-7T00%3A00%3A00&endDate=2022-3-19%2000%3A00%3A00&location=testcountry")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss) *can use 'x' for filler but year can't be filler. You entered:2022-3-7T00:00:00 to 2022-3-19 00:00:00"

def test_search_incorrect_start_end_date():
    response = client.get("/v1/search?startDate=2022-3-7%2000%3A00%3A00&endDate=2022-3-19%2000%3A00%3A00&location=testcountry")
    assert response.status_code == 400
    assert response.json() == "Correct date format (yyyy-MM-ddTHH:mm:ss) *can use 'x' for filler but year can't be filler. You entered:2022-3-7 00:00:00 to 2022-3-19 00:00:00"

def test_search_backward_date():
    response = client.get("/v1/search?startDate=2022-3-8T00%3A00%3A00&endDate=2022-3-7T00%3A00%3A00&location=testcountry")
    assert response.status_code == 400
    assert response.json() == "starting date needs to be before the ending date. You entered:2022-3-8T00:00:00 to 2022-3-7T00:00:00"
    

    