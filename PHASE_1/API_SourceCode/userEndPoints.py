from audioop import cross
from csv import Dialect
from tracemalloc import start
from fastapi import status, HTTPException
from fastapi.responses import JSONResponse
from firebase_admin import auth
from firebase_admin import exceptions
import json
from pydantic import BaseModel


class userCreationModel(BaseModel):
    email: str
    country: str
    username: str
    city: str = None
    state: str = None
    password: str
    age: int = None


class userIdModel(BaseModel):
    uid: str


# Reorders the queryresults to have a consistent format


def reorderFields(queryResult):
    orderOfFields = [
        "username",
        "city",
        "state",
        "age",
        "alerts",
        "country",
        "badges",
        "completed",
        "score",
    ]
    return {k: queryResult.to_dict()[k] for k in orderOfFields}


def toJsonResponse(statusCode, body):
    return JSONResponse(status_code=statusCode, content=body)


def createUserEntry(db, userInfo: userCreationModel):
    try:
        user = auth.create_user(email=userInfo.email, password=userInfo.password)
        successResponse = {"status": "success", "uid": user.uid}
        createUserDetail = {
            "username": userInfo.username,
            "country": userInfo.country,
            "state": userInfo.state,
            "city": userInfo.city,
            "age": userInfo.age,
            "alerts": [],
            "completed": {},
            "badges": [],
            "score": 0,
        }
        try:
            db.collection("userDetails").document(user.uid).set(createUserDetail)
            return successResponse
        except:
            return toJsonResponse(409, {"status": "failed_userDetailExists", "uid": 0})
    except exceptions.FirebaseError:
        failedReponse = {"status": "failed_userExists", "uid": 0}
        return toJsonResponse(409, failedReponse)
    except ValueError:
        failedReponse = {"status": "failed_valueError", "uid": 0}
        return toJsonResponse(400, failedReponse)


def deleteUserEntry(db, userId: str):
    try:
        auth.delete_user(userId)
        db.collection("userDetails").document(userId).delete()
        return toJsonResponse(204, {})
    except:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"user with {userId} wasn't found",
        )


def getUserDetail(db, uid: str):
    #
    try:
        query = db.collection("userDetails").document(uid).get()
    except:
        
        return toJsonResponse(500, "User id doesnt exist")
    queryDict = reorderFields(query)
    
    badges = []
    for badge in queryDict["badges"]:
        getBadge = db.collection("badges").document(badge).get().to_dict()
        badges.append(getBadge)
    queryDict["badges"] = badges
    print(queryDict)
    return toJsonResponse(200, queryDict)


def getTotalActivities(disease, db):
    try:
        hangman = db.collection("hangman").document(disease).get().to_dict()
        if hangman == None:
            hangman = {"words": []}
        quizzes = db.collection("quizzes").document(disease).get().to_dict()
        if quizzes == None:
            quizzes = {"quizzes": []}
        crosswords = (
            db.collection("crosswords").document(disease).collection("crosswords").get()
        )
        if crosswords == None:
            crosswords = []
    except:
        return -1
    print(disease)
    return len(hangman["words"]) + len(quizzes["quizzes"]) + len(crosswords)


def getProgressDiseases(db, uid: str):
    try:
        query = db.collection("userDetails").document(uid).get().to_dict()
    except:
        return toJsonResponse(500, "User id doesnt exist")
    return_dict = {}
    print(uid)
    allDiseases = query["completed"]
    for disease in allDiseases.keys():
        totalActivities = getTotalActivities(disease, db)
        if totalActivities == -1:
            return toJsonResponse(500, "Error Collecting activities")
        specificDisease = allDiseases[disease]
        completedActivities = (
            len(specificDisease["hangman"])
            + len(specificDisease["quizzes"])
            + len(specificDisease["crosswords"])
        )
        if totalActivities == 0:
            percentage = 0
        else:
            percentage = completedActivities / totalActivities
        return_dict[disease] = int(percentage * 100)
    return_dict = dict(sorted(return_dict.items(), key=lambda x: x[1], reverse=True))
    return return_dict


def getUnprogressedDiseases(db, uid: str):
    try:
        query = db.collection("userDetails").document(uid).get().to_dict()
    except:
        return toJsonResponse(500, "User id doesnt exist")
    startedDiseases = query["completed"].keys()
    try:
        query = db.collection("diseases").get()
    except:
        return toJsonResponse(500, "User id doesnt exist")
    totalDiseases = []
    for disease in query:
        totalDiseases.append(disease.id)
    return list(totalDiseases - startedDiseases)


def getLeaders(db):

    try:
        query = db.collection("userDetails").get()
    except:
        return toJsonResponse(500, "error with database")
    usersArray = []
    for user in query:
        usersdict = {}

        try:
            indiv = user.to_dict()

            usersdict["Name"] = indiv["username"]
            usersdict["Points"] = indiv["score"]
            usersdict["userId"] = user.id
            usersArray.append(usersdict)
        except:
            return toJsonResponse(500, "Issue getting users")

    finalList = sorted(usersArray, key=lambda e: e["Points"], reverse=True)
    count = 1
    for dict in finalList:
        dict["id"] = count
        count += 1
    return finalList
