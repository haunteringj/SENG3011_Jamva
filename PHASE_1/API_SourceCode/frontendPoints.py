from fastapi.responses import JSONResponse

# returns a json response
def toJsonResponse(statusCode, body):
    return JSONResponse(status_code=statusCode, content=body)


def fetchTopDieseases(db, continent):
    
    # check if disease is not a string
    if continent.isdigit():
        return toJsonResponse(
            400,
            f"You entered a digit instead of string for top Dieseases",
        )

    query = []
    try:
        query = db.collection("top5Diseases").document(continent).get()
    except:
        return toJsonResponse(500, "Unable to fetch from database")

    if query.exists:
        return toJsonResponse(200, query.to_dict())
    else:
        return toJsonResponse(
            404, f"no reports"
        )