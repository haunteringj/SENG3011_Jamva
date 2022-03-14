from fastapi.testclient import TestClient
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import sys
import json


def test_is_alive():
  #response = client.get("/v1/alive")
  
  #print(response)
  return

def test_new_user():
  #jsonValue = {"email": "jackwhaling99@gmail.com", "password": "Test1234"}
  #response = client.post(json=jsonValue)
  #print(response)
  return

if __name__ == "__main__":
  print(sys.path)
  test_is_alive()
  test_new_user()