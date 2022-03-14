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

def formListOfOutbreaks(diseases_info):
    listOfOutbreaks = []
    for outbreak in diseases_info['outbreaks']:
        outbreakDict = outbreak.get().to_dict()
        outbreakDict.pop('disease')
        listOfOutbreaks.append(outbreakDict)
    return listOfOutbreaks

def formDiseaseInfo(location_info):
    disease = location_info.get().to_dict()
    disease.pop('outbreaks')
    
    return disease

# Endpoints
def fetchDiseaseByName(db, disease):
    # check if disease is not a string
    if disease.isdigit():
        return toJsonResponse(400, f"diseases are searched with a disease name (e.g Smallpox). You entered:{disease}")
    
    query = []
    
    try:
        query = db.collection('diseases').where('diseaseName', '==', disease)
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query.get() == []:
        return toJsonResponse(404, f"no diseases was found with that name. You entered:{disease}")
    
    diseases_info = query.get()[0].to_dict()
    
    diseases_info['outbreaks'] = formListOfOutbreaks(diseases_info)
    
    return toJsonResponse(200, diseases_info)

def fetchDiseaseByLocation(db, location):
    
    # check if disease exists/is a string
    if location.isdigit():
        return toJsonResponse(400, f"diseases are searched with a country code (e.g AU). You entered:{location}")
    
    try:
        query = db.collection('outbreaks').where('country','==', location)
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query.get() == []:
        return toJsonResponse(404, f"no diseases was found in that location. You entered:{location}")
    
    location_info = query.get()[0].to_dict()
    
    location_info['disease'] = formDiseaseInfo(location_info['disease'])
    
    print(location_info)
    
    return toJsonResponse(200, query)