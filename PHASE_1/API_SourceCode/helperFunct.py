from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin
from firebase_admin import db
import pycountry
import datetime

cred = credentials.Certificate("../dataBasePrivateKey.json")
firebase_admin.initialize_app(
    cred,
    {
        "projectId": "jamva-real",
    },
)


db = firestore.client()

dailyReportRef = db.collection("dailyReports").document("daily")
data = dailyReportRef.get()
for i in data.to_dict()["diseaseMap"]:
  for key, value in i.items():
    print(key + " and  country: ")
    print(value[0])