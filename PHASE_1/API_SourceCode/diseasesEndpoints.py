from datetime import datetime
from fastapi.responses import JSONResponse
import json

# returns a json response
def toJsonResponse(statusCode, body):
    return JSONResponse(status_code=statusCode, content=body)


# Endpoints
def fetchDiseaseByName(db, disease):
    # check if disease is not a string
    if disease.isdigit():
        return toJsonResponse(
            400,
            f"diseases are searched with a disease name (e.g Smallpox). You entered:{disease}",
        )

    query = []
    try:
        query = db.collection("diseases").where("diseaseName", "==", disease.lower())
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    if query.get() == []:
        return toJsonResponse(
            404, f"no diseases was found with that name. You entered:{disease}"
        )
    diseases_info = query.get()[0].to_dict()
    diseases_info["reports"] = dereferenceReports(diseases_info["reports"])
    return toJsonResponse(200, diseases_info)


def dereferenceReports(reports):
    reportsList = []
    for report in reports:
        try:
            indiv = report.get().to_dict()
        except:
            indiv = report
        indiv["article"] = indiv["article"].get().to_dict()
        indiv["article"]["date_of_publication"] = formatDateTime(
            indiv["article"]["date_of_publication"]
        )
        indiv["event_date"] = formatDateTime(indiv["event_date"])
        del indiv["article"]["reports"]
        del indiv["diseases"]
        locations = []
        for location in indiv["locations"]:
            addLoc = location.get().to_dict()
            del addLoc["articles"]
            locations.append(addLoc)
        indiv["locations"] = locations
        reportsList.append(indiv)
    return reportsList


def formatDateTime(dt):
    return f"{dt.year}-{dt.month:02}-{dt.day:02}T{dt.hour:02}:{dt.minute:02}:{dt.second:02}"


def fetchDiseaseByLocation(db, location):
    # check if disease exists/is a string
    if location.isdigit():
        return toJsonResponse(
            400,
            f"diseases are searched with a country code (e.g AU). You entered:{location}",
        )
    try:
        reports = db.collection("reports").get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    listOfReports = []

    # go through each entries in outbreak with stated location
    for report in reports:
        indiv = report.to_dict()
        countries = indiv["locations"]
        for country in countries:
            if country.get().to_dict()["id"] == location:
                listOfReports.append(indiv)
                break
    if listOfReports == []:
        return toJsonResponse(
            404, f"no diseases was found in that location. You entered:{location}"
        )
    listOfReports = dereferenceReports(listOfReports)
    return toJsonResponse(200, listOfReports)
