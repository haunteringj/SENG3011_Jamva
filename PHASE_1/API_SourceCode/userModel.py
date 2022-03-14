from pydantic import BaseModel

class userCreationModel(BaseModel):
  email: str
  country: str
  city: str = None
  password: str
  age: int

class userIdModel(BaseModel):
  uid: str
