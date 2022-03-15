from API_SourceCode import app
from datetime import datetime
from fastapi.testclient import TestClient
from firebase_admin import firestore
import json


client = TestClient(app)

# connect to database
db = firestore.client()


def test_is_alive():
  response = client.get("/v1/alive")
  assert response.status_code == 200
  assert response.json() == {"hello": "JAMVA"}
  return

def test_new_user():
  jsonValue = {
    "email": "jackwhaling99@gmail.com", 
    "password": "Test1234", 
    "country": "AUS",
    "state": "NSW",
    "city": "Sydney",
    "username": "JacksAccount2",
    "age": 23,
  }
  response = client.post("/v1/users/create", json=jsonValue)
  jsonData = json.loads(response.json())
  uid = str(jsonData.get("uid"))
  assert response.status_code == 201
  response = client.delete(f"/v1/users/delete/{uid}")
  assert response.status_code == 204
  return

def test_existing_user():
  jsonValue = {
    "email": "jackwhaling99@gmail.com", 
    "password": "Test1234", 
    "country": "AUS", 
    "city": "Sydney",
    "state": "NSW",
    "username": "JacksAccount2",
    "age": 23,
  }
  response_one = client.post("/v1/users/create", json=jsonValue)
  response_two = client.post("/v1/users/create", json=jsonValue)
  jsonData = json.loads(response_two.json())
  deleteData = json.loads(response_one.json())
  uid = str(deleteData.get("uid"))
  assert jsonData.get("status") == "failed_userExists"
  assert response_two.status_code == 409
  client.delete(f"/v1/users/delete/{uid}")

def test_delete_user():
  jsonValue = {
    "email": "jackwhaling99@gmail.com", 
    "password": "Test1234", 
    "country": "AUS",
    "state": "NSW",
    "city": "Sydney",
    "username": "JacksAccount2",
    "age": 23,
  }
  response = client.post("/v1/users/create", json=jsonValue)
  jsonData = json.loads(response.json())
  uid = str(jsonData.get("uid"))
  response = client.delete(f"/v1/users/delete/{uid}")
  assert response.status_code == 204

def test_false_delete():
  response = client.delete("/v1/users/delete/0")
  assert response.status_code == 409

def test_get_user_detail():
  jsonValue = {
    "email": "jackwhaling99@gmail.com", 
    "password": "Test1234", 
    "country": "AUS",
    "state": "NSW",
    "city": "Sydney",
    "username": "JacksAccount2",
    "age": 23,
  }
  response = client.post("/v1/users/create", json=jsonValue)
  jsonData = json.loads(response.json())
  uid = str(jsonData.get("uid"))
  response = client.get(f"/v1/users/details/{uid}")
  assert response.json() == {"username":"JacksAccount2","city":"Sydney","state":"NSW","age":23,"alerts":[],"country":"AUS"}
  assert response.status_code == 200
  client.delete(f"/v1/users/delete/{uid}")
