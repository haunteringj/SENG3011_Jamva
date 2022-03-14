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
  client.delete(f"/v1/users/delete/{uid}")
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
  client.post("/v1/users/create", json=jsonValue)
  response = client.post("/v1/users/create", json=jsonValue)
  jsonData = json.loads(response.json())
  uid = str(jsonData.get("uid"))
  assert jsonData.get("status") == "failed_userExists"
  assert response.status_code == 409
  client.delete("/v1/users/delete/" + uid)

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
  response = client.delete("/v1/users/delete/" + uid)
  assert response.status_code == 204

def test_false_delete():
  response = client.delete("/v1/users/delete/s0")
  assert response.status_code == 500

if __name__ == "__main__":
  test_new_user()