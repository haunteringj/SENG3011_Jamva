from ast import excepthandler
from asyncio import QueueEmpty
from asyncio.windows_events import NULL
from datetime import datetime
from dis import dis
from fastapi import Query
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

def fetchWords(db,id, userId):
    try:
        allWords = db.collection("hangman").document(id).get().to_dict()
        allWords = allWords["words"]
        Query = db.collection("userDetails").document(userId).get().to_dict()
        completedWords = Query["completed"][id]["hangman"]
        
        print(list(set(allWords.keys()) - set(completedWords)))
        return {"allwords":list(allWords.keys()),"facts":allWords, "difference":list(set(allWords.keys()) - set(completedWords))}
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


def completeWord(db,disease, userId, word):
    try:
        query = db.collection("userDetails").document(userId)
        dictVer = query.get().to_dict()
        completed = dictVer["completed"]
        points = dictVer["score"]
        completed[disease]["hangman"].append(word)
        print(completed)
        query.update({"completed" : completed, "score":points+len(word)*10})
        return toJsonResponse(200,"OK")
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def fetchCompletedQuizzes(db,disease,userId):
    try:
        query = db.collection("userDetails").document(userId)
        getted = query.get().to_dict()
        if(disease in getted["completed"].keys()):
            quizzes = getted["completed"][disease]["quizzes"]
        else:
            completed = getted["completed"]
            completed[disease] ={"quizzes":{}, "hangman":[],"crosswords":[]
            }
            query.update({"completed" : completed})
            quizzes = []

        return toJsonResponse(200, quizzes)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def completeQuiz(db,disease,userId,QuizId,score):
    try:
        print(score)
        score = int(score)
        query = db.collection("userDetails").document(userId)
        dictVer = query.get().to_dict()
        completed = dictVer["completed"]
        points = dictVer["score"]
        oldscore = completed[disease]["quizzes"]
        if QuizId in oldscore.keys():
            print(oldscore[QuizId], score)
            if int(oldscore[QuizId]) < score:
                olderscore = int(oldscore[QuizId])
                completed[disease]["quizzes"][QuizId] = score
                query.update({"completed" : completed, "score":points+(score - olderscore)*10})
                return toJsonResponse(200,{"score":(score - olderscore)*10})
        else:
            completed[disease]["quizzes"][QuizId] = score
            query.update({"completed" : completed, "score":points+(score)*10})
            return toJsonResponse(200,{"score":(score)*10})
        return toJsonResponse(200,{"score":0})
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def getCompletedCrosswords(db,disease, userId):
    try:
        query = db.collection("userDetails").document(userId).get().to_dict()
        quizzes = query["completed"][disease]["crosswords"]

        return toJsonResponse(200, quizzes)
    except:
        return toJsonResponse(500, "Unable to fetch from database")

def completeCrossword(db,disease, crosswordId, userId):
    try:
        query = db.collection("userDetails").document(userId)
        dictVer = query.get().to_dict()
        completed = dictVer["completed"]
        points = dictVer["score"]
        completed[disease]["crosswords"].append(crosswordId)
        print(completed)
        query.update({"completed" : completed, "score":points+300})
        return toJsonResponse(200,"OK")
    except:
        return toJsonResponse(500, "Unable to fetch from database")