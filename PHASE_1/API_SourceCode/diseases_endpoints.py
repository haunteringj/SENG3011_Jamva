from datetime import datetime
from fastapi.responses import JSONResponse
from firebase_admin import firestore
import json
import disease_list.json

# Reorders the queryresults to have a consistent format
def reorderFields(queryResult):
    orderOfFields = ["id", "title", "publishDate", "disease", "country", "content"]
    return {k: queryResult.to_dict()[k] for k in orderOfFields}

# form list of Articles from a query get result
def formListOfArticles(queryGetResult):
    listOfArticles = []
    for queryResult in queryGetResult:
        listOfArticles.append(reorderFields(queryResult))
    return listOfArticles

# returns a json response 
def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.dumps(content, default=str),
    )

# Endpoints
    
def diseases_search(disease):
    
    # check if disease exists/is a string
    if !disease.isaplha():
        return toJsonResponse(400, "diseases are searched with a disease query (e.g MERS). You entered:{disease}")
    
    try:
        query = db.collection('diseases').where('diseases', '==', disease).steam()
    except:
        return toJsonResponse(500, "Unable to fetch from database")
    
    if query = []:
        return toJsonResponse(404, "no diseases was found with that name. You entered:{disease}")
    
    return toJsonResponse(200, query)

def diseases_locations(location):
    
    # check if location is a string
    print("placeholder")
