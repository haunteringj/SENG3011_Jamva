from fastapi.responses import JSONResponse
import json
from firebase_admin import firestore
import pycountry
from geopy.exc import GeocoderTimedOut
from geopy.geocoders import Nominatim



def toJsonResponse(statusCode, body):
    return JSONResponse(status_code=statusCode, content=json.loads(json.dumps(body, default=str)))

def getLatLong(country):
    try:
        geolocator = Nominatim(user_agent="arbitrary_app_name")
        return geolocator.geocode(country)
    except GeocoderTimedOut:
        return "timed out"


def fetchTopDiseases(db, continent):

    # check if disease is not a string
    if continent.isdigit():
        return toJsonResponse(
            400,
            f"You entered a digit instead of string for top Dieseases",
        )

    query = []
    try:
        query = db.collection("top5Diseases").document(continent).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    if query.exists:
        return toJsonResponse(200, query.to_dict())
    else:
        return toJsonResponse(
            404, f"no reports"
        )


def getLatestReports(db):
    countries = {}
    # reports = []
    results = db.collection("reports").order_by(
        u'event_date', direction=firestore.Query.DESCENDING).limit(100).stream()
    
    # get a list of all the reports
    # add the countries into a list
    # add the reports to the corresponding countries


    for r in results:
        reportDict = {}
        tr = r.to_dict()
        # for field in tr:
        listLoc = []
        for location in tr["locations"]:
                # just add the location name
            listLoc.append(location.get().to_dict()['countryName'])

        # reportDict["locations"] = listLoc[0]
        # countries[listLoc[0]] = []
        article = tr["article"].get().to_dict()
        reportDict["id"] = article["id"]
        reportDict["headline"] = article["headline"]
        reportDict["source"] = article["url"]
        reportDict["date"] = tr["event_date"]

        #if the location does not exist in the countries dict
        #add the location and add the report to that location
        loc = getLatLong(listLoc[0])
        if listLoc[0] in countries:
            countries[listLoc[0]]["reports"].append(reportDict)
        else:
            countries[listLoc[0]] = {}
            countries[listLoc[0]]["reports"] = []
            countries[listLoc[0]]["reports"].append(reportDict)

        countries[listLoc[0]]["lat"] = loc.latitude
        countries[listLoc[0]]["long"] = loc.longitude
    return toJsonResponse(200, countries)
