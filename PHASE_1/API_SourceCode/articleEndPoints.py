from datetime import datetime
from fastapi.responses import JSONResponse
from firebase_admin import firestore
import json
import re
import pycountry

# Reorders the articles field and deferences report field
def reorderArticleFields(queryResult):
    orderOfFields = ["url", "date_of_publication", "headline", "main_text", "reports"]
    orderDict = {}
    for k in orderOfFields:
        # Deference disease to get content of linked disease
        if k == "reports":
            listOfReports = []
            for report in queryResult.to_dict()[k]:
                orderDict[k] = dereferenceReports(report.get().to_dict())
        else:
            orderDict[k] = queryResult.to_dict()[k]
    return orderDict

# Reorders the report field to have a consistent format
def reorderReportfields(report):
    orderOfFields = ["diseases", "syndromes", "event_date", "locations"]
    return {k: report[k] for k in orderOfFields}

# dereferences all fields in report
def dereferenceReports(report):
    reportDict = {}
    for field in report:
        # dereference locations
        if field == "locations":
            listOfLocations = []
            for location in report[field]:
                # just add the location name
                listOfLocations.append(location.get().to_dict()['countryName'])
            reportDict[field] = listOfLocations
        # ignore article field
        elif field == "article":
            pass
        # dereference diseases
        elif field == "diseases":
            listOfDiseases = []
            for disease in report[field]:
                # just add disease name
                listOfDiseases.append(disease.get().to_dict()['diseaseName'])
                # add syndromes to the report's field
                reportDict["syndromes"] =disease.get().to_dict()['syndromes']
            reportDict[field] = listOfDiseases
        # other field are just their values
        else:
            reportDict[field] = report[field]
    return reorderReportfields(reportDict)

# form list of Articles from a query get result
def formListOfArticles(queryGetResult):
    listOfArticles = []
    for queryResult in queryGetResult:
        listOfArticles.append(reorderArticleFields(queryResult))
    return listOfArticles

# returns a json response 
def toJsonResponse(statusCode, body):
    return JSONResponse(
        status_code=statusCode,
        content=json.loads(json.dumps(body, default= str))
    )

# Endpoints
def fetchlatestArticle(db):
    # number of latest articles to be returned
    noOfArticles = 20

    # query database
    try:
        query = db.collection("articles").order_by("date_of_publication", direction=firestore.Query.DESCENDING).limit(noOfArticles).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    listOfArticles = formListOfArticles(query)
    if (listOfArticles == []):
        return toJsonResponse(500, "Our database is empty :O Very Odd please contant development")
    else:
        return toJsonResponse(200, formListOfArticles(query))

def fetchByIdArticle(db, id):
    # check if id is an integer
    try:
        id = int(id)
    except:
        return toJsonResponse(400, "articles are searched with an article id (e.g 8701648). You entered:{}".format(id))
    
    # query data base
    query = db.collection('articles').where('id', '==', id).stream()
    try: 
        article = reorderArticleFields(next(query))
    except:
        return toJsonResponse(404,"no articles was found with that id. You entered:{}".format(id))

    # return the article
    return toJsonResponse(200,  json.loads(json.dumps(article , default= str)))

def fetchByCountry(db, country):
    # check if country is an string
    try:
        country = str(country)
    except:
        return toJsonResponse(400, "articles are searched with a country name (e.g America). You entered:{}".format(country))
    
    # preprocessing to match country name
    countryProcessedName = country.lower()
    countryProcessedName = ''.join(countryProcessedName.split())
    try:
        countryCode = pycountry.countries.get(name=countryProcessedName).alpha_2
    except:
        return toJsonResponse(404, "no articles was found with that country. You entered:{}".format(country))
        
    # query data base
    docRef = db.document('countries/{}'.format(countryCode))
    query = db.collection('reports').where('locations', "array_contains", docRef).get()
    listOfArticles = []
    for entry in query:
        listOfArticles.append(reorderArticleFields(entry.to_dict()["article"].get()))
    if (listOfArticles == []):
        return toJsonResponse(404, "no articles was found with that country. You entered:{}".format(country))
    else:
        return toJsonResponse (200, listOfArticles)

def fetchByDisease(db, disease):
    # check if disease is an string
    try:
        disease = str(disease)
    except:
        return toJsonResponse (400, "articles are searched with a disease name (e.g Covid 19). You entered:{}".format(disease))
    
    # preprocessing to match disease name
    diseaseProcessedName = disease.lower()

    # query data base
    docRef = db.document('diseases/{}'.format(diseaseProcessedName))
    query = db.collection('reports').where('diseases', "array_contains", docRef).get()
    listOfArticles = []
    for entry in query:
        listOfArticles.append(reorderArticleFields(entry.to_dict()["article"].get()))
    if (listOfArticles == []):
        return toJsonResponse (404, "no articles was found with that disease. You entered:{}".format(disease))
    else:
        return toJsonResponse(200, listOfArticles)

def fetchByDateArticle(db, startDate, endDate = ""):
    # convert start date from string to datetime
    try: 
        start = datetime.strptime(startDate,"%Y-%m-%dT%H:%M:%S")
    except:
        if (endDate == ""):
            return toJsonResponse(400, "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:{}".format(startDate))
        return toJsonResponse(400, "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:{} to {}".format(startDate, endDate))
        
    # convert end date from string to datetime
    if (endDate != ""):
        try: 
            end = datetime.strptime(endDate,"%Y-%m-%dT%H:%M:%S")
        except:
            return toJsonResponse(400, "Correct date format (yyyy-MM-ddTHH:mm:ss).You entered:{} to {}".format(startDate, endDate))

        # return a list of articles inbetween the start and end dates (inclusive)
        # query data base
        query = db.collection('articles').where('date_of_publication', '>=', start).where('date_of_publication', '<=', end).get()
        listOfArticles = formListOfArticles(query)

        if (listOfArticles == []):
            return toJsonResponse(404, "no articles were found with your specified date(s). You entered:{} to {}".format(startDate, endDate))
        else:
            return toJsonResponse(200, listOfArticles)
    else:
        # return a list of articles after the start date (inclusive)
        # query data base
        query = db.collection('articles').where('date_of_publication', '>=', start).get()
        listOfArticles = formListOfArticles(query)

        if (listOfArticles == []):
            return toJsonResponse(404, "no articles were found with your specified date(s). You entered:{}".format(startDate))
        else:
            return toJsonResponse(200, listOfArticles)

def search(db,startDate, endDate, location, keyTerms = ""):
    # convert date from string to dateTime
    start = convertDate(startDate)
    end = convertDate(endDate)
    # check for valid date input
    if start == "Invalid date input" or end == "Invalid date input":
        return toJsonResponse(400, "Correct date format (yyyy-MM-ddTHH:mm:ss) *can use 'x' for filler but year can't be filler. You entered:{} to {}".format(startDate, endDate))
    elif start > end:
        return toJsonResponse(400, "starting date needs to be before the ending date. You entered:{} to {}".format(startDate, endDate))
    # query data base with date restriction
    query = db.collection('articles').where('date_of_publication', '>=', start).where('date_of_publication', '<=', end).get()
    listOfArticles = formListOfArticles(query)

    # filter results with keyTerms and location
    finalListOfArticles = []
    for article in listOfArticles:
        terms = keyTerms.split(",")
        for term in terms:
            if re.search(term, article['main_text'], re.IGNORECASE) != None and location.lower() in article['reports']['locations']:
                finalListOfArticles.append(article)
                break
    if finalListOfArticles == []:
        return toJsonResponse(404, "no articles were found")
    
    return toJsonResponse(200, finalListOfArticles)

# converts date from string to datetime. Returns datetime or error message
def convertDate(date):
    # when date string has "T" to separate date and time
    try:
        parts = date.split("T")
        datePart = parts[0]
        timePart = parts[1]
    except:
        return "Invalid date input"
    datePart = datePart.replace("xx", "01")
    timePart = timePart.replace("x", "0")
    try: 
        return datetime.strptime(datePart + "T" + timePart,"%Y-%m-%dT%H:%M:%S")
    except:
        return "Invalid date input"
