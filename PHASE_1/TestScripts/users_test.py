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
    "city": "Sydney",
    "age": 23,
  }
  response = client.post("/v1/users/create", json=jsonValue)
  assert response.status_code == 201
  print(response)
  return

if __name__ == "__main__":
  test_new_user()