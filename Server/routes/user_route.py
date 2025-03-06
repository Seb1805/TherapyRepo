from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from models import PatientExercise
from database import get_database
from models import User, UserUpdate
from datetime import datetime


router = APIRouter()


# Body(...) Parameter
# The Body(...) parameter serves several purposes fastapi.tiangolo.com:

# Indicates that this parameter should come from the request body
# Automatically parses incoming JSON data into a Pydantic model
# Provides automatic validation against the User model
# Generates OpenAPI documentation for the endpoint
# Without Body(...), FastAPI wouldn't know to extract this data from the request body. The ellipsis (...) indicates that this is a required field - without it, the parameter would be optional.

@router.post("/", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
async def create_user(request: Request, user: User = Body(...)):
    user = jsonable_encoder(user)
    new_user =  await request.app.database["users"].insert_one(user)
    created_user = await request.app.database["users"].find_one(
        {"_id": new_user.inserted_id}
    )

    return created_user

# @router.get("/", response_description="List all books", response_model=List[Book])
# def list_books(request: Request):
#     books = list(request.app.database["books"].find(limit=100))
#     return books