from datetime import datetime
from fastapi.responses import JSONResponse
from firebase_admin import firestore
import json

# returns a json response 
def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(content, default=str),
    )

# Endpoints
def fetchDiseaseByName(db, disease):
    # check if disease is not a string
    if disease.isdigit():
        return toJsonResponse(400, f"diseases are searched with a disease name (e.g Smallpox). You entered:{disease}")
    
    query = []
    
    try:
        query = db.collection('diseases').where('diseaseName', '==', disease).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query == []:
        return toJsonResponse(404, f"no diseases was found with that name. You entered:{disease}")
    
    return toJsonResponse(200, query)

def fetchDiseaseByLocation(db, location):
    
    # check if disease exists/is a string
    if location.isdigit():
        return toJsonResponse(400, f"diseases are searched with a country code (e.g AU). You entered:{location}")
    
    try:
        query = db.collection('outbreaks').where('country','==', location).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query == []:
        return toJsonResponse(404, f"no diseases was found in that location. You entered:{location}")
    
    return toJsonResponse(200, query)