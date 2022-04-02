from ast import excepthandler
from datetime import datetime
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
        query = db.collection("quizzes").add(quiz)
        print(query)
        return toJsonResponse(200, "Success")
    except:
        return toJsonResponse(500, "Unable to fetch from database")


def fetchQuizzes(db):
    try:
        query = db.collection("quizzes").get()
        quizzes = []
        for quiz in query:
            dictionary = quiz.to_dict()
            dictionary["id"] = quiz.id
            quizzes.append(dictionary)

        return toJsonResponse(200, quizzes)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def fetchQuiz(db,id):
    try:
        query = db.collection("quizzes").document(id).get().to_dict()

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
