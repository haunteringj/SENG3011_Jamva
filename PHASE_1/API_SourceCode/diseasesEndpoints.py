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
def diseases_search(disease):
    # check if disease is not a string
    if not disease.isaplha():
        return toJsonResponse(400, "diseases are searched with a disease query (e.g Smallpox). You entered:{disease}")
    
    try:
        query = db.collection('diseases').where('diseases', '==', disease).steam()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query == []:
        return toJsonResponse(404, "no diseases was found with that name. You entered:{disease}")
    
    return toJsonResponse(200, query)

def diseases_locations(location):
    
    # check if disease exists/is a string
    if not location.isaplha():
        return toJsonResponse(400, "diseases are searched with a disease location (e.g 'australia'). You entered:{location}")
    
    try:
        #query = db.collection('diseases').where(any(location in locations[])).steam()
        print("hi")
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query == []:
        return toJsonResponse(404, "no diseases was found in that location. You entered:{location}")
    
    return toJsonResponse(200, query)