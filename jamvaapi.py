from fastapi import FastAPI

app = FastAPI()

@app.get("/v1/alive")
def alive():
  return {"hello": "JAMVA"}