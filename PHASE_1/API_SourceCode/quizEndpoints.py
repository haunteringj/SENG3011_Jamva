from ast import excepthandler
from datetime import datetime
from dis import dis
from firebase_admin import firestore
from fastapi.responses import JSONResponse

try:
    from articleEndPoints import dereferenceReports
except:
    from .articleEndPoints import dereferenceReports
import json
import re

# returns a json response


def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.loads(json.dumps(content, default=str)),
    )


def newQuiz(db, quiz):
    
    try:
        query = db.collection("quizzes").document(quiz["disease"]).get()
        
        if query.exists:
            
            query = db.collection("quizzes").document(quiz["disease"])
            query.update({"quizzes": firestore.ArrayUnion([quiz])})
        else:
            db.collection("quizzes").document(quiz["disease"]).set({"quizzes":[quiz]})

        return toJsonResponse(200, "Success")
    except:
        return toJsonResponse(500, "Unable to fetch from database")


def fetchQuizzes(db,disease):
    print(disease)
    try:
        query = db.collection("quizzes").document(disease).get()
        quizzes = []
        if query.exists:
            quizzes = query.to_dict()["quizzes"]
        
        return toJsonResponse(200, quizzes)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def fetchQuiz(db,disease,id):
    try:
        
        query = db.collection("quizzes").document(disease).get().to_dict()
        print(query)
        query = query["quizzes"][int(id)]
        return toJsonResponse(200, query)
    except:
        return toJsonResponse(500, "Unable to fetch from database")
def addAnswer(db,id, questionData):
    try:
        query = db.collection("answers").add(questionData)
        print("DOC",query[1].id)
        return toJsonResponse(200,{"answerId": query[1].id})
    except:
        return toJsonResponse(500, "Unable to fetch from database")


def fetchAnswer(db,id):
    try:
        query = db.collection("answers").document(id).get().to_dict()

        return toJsonResponse(200, query)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def fetchWords(db,id):
    try:
        query = db.collection("hangman").document(id).get().to_dict()

        return toJsonResponse(200, query)
    except:
        return toJsonResponse(500, "Unable to fetch from database")


def fetchCrossword(db,disease,id):
    try:
        query = db.collection("crosswords").document(disease).collection("crosswords").document(id).get().to_dict()

        return toJsonResponse(200, query)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def fetchCrosswords(db,id):
    try:
        query = db.collection("crosswords").document(id).collection("crosswords").get()
        crosswords = []
        for quiz in query:
            dictionary = quiz.to_dict()
            dictionary["id"] = quiz.id
            crosswords.append(dictionary)

        return toJsonResponse(200, crosswords)
    except:

        return toJsonResponse(500, "Unable to fetch from database")