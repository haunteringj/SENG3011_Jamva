from datetime import datetime
from fastapi.responses import JSONResponse
import json

# returns a json response 
def toJsonResponse(statusCode, body):
    return JSONResponse(
        status_code=statusCode,
        content=body
    )

def formListOfOutbreaks(diseases_info):
    listOfOutbreaks = []
    for outbreak in diseases_info['outbreaks']:
        outbreakDict = outbreak.get().to_dict()
        outbreakDict.pop('disease')
        listOfOutbreaks.append(json.loads(json.dumps(outbreakDict,  default= str)))
    return listOfOutbreaks

# Endpoints
def fetchDiseaseByName(db, disease):
    # check if disease is not a string
    if disease.isdigit():
        return toJsonResponse(400, f"diseases are searched with a disease name (e.g Smallpox). You entered:{disease}")
    
    query = []
    try:
        query = db.collection('diseases').where('diseaseName', '==', disease.lower())
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
        query = db.collection('outbreaks').where('country','==', location).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    if query == []:
        return toJsonResponse(404, f"no diseases was found in that location. You entered:{location}")
    
    listOfDisease = []
    # go through each entries in outbreak with stated location
    for entry in query:
        # order of the fields to be shown
        orderOfFields = ["date", "cases", "disease", "country"]
        orderDict = {}
        for k in orderOfFields:
            # Deference disease to get content of linked disease
            if k == "disease":
                orderDict[k] = entry.to_dict()[k].get().to_dict()
            else:
                orderDict[k] = entry.to_dict()[k]
        listOfDisease.append(json.loads(json.dumps(orderDict, default= str)))

    return toJsonResponse(200, listOfDisease)
