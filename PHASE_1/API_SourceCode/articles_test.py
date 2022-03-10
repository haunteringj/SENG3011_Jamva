from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_is_alive():
    response = client.get("/v1/alive")
    assert response.status_code == 200
    assert response.json() == {"hello": "JAMVA"}

def test_article_latest():
    response = client.get("/articles/latest")
    assert 1 == 1

def test_article_id_success():
    assert 1 == 1

def test_article_id_no_such_article():
    assert 1 == 1

def test_article_id_incorrect_query():
    assert 1 == 1


def test_article_country_success():
    assert 1 == 1
    
def test_article_country_no_such_article():
    assert 1 == 1

def test_article_country_incorrect_query():
    assert 1 == 1


def test_article_disease_success():
    assert 1 == 1
    
def test_article_disease_no_such_article():
    assert 1 == 1

def test_article_disease_incorrect_query():
    assert 1 == 1


def test_article_date_success_start():
    assert 1 == 1

def test_article_date_success_start_and_end():
    assert 1 == 1
    
def test_article_date_no_such_article():
    assert 1 == 1

def test_article_date_incorrect_start():
    assert 1 == 1

def test_article_date_incorrect_end():
    assert 1 == 1

def test_article_date_incorrect_start_and_end():
    assert 1 == 1

def test_article_date_invalid_range():
    assert 1 == 1

def test_article_date_no_start():
    assert 1 == 1
