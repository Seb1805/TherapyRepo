from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from models import PatientExercise
from database import get_database
from models import User, UserUpdate
from datetime import datetime
import bcrypt



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
    user_data = jsonable_encoder(user)
    if user_data.get("password"):
        hashed_password = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())
        user_data["password"] = hashed_password.decode('utf-8')
    new_user = await request.app.database["users"].insert_one(user_data)
    created_user = await request.app.database["users"].find_one(
        {"_id": new_user.inserted_id}
    )

    return created_user

@router.put("/update_user/{user_id}", response_description="Update a user", response_model=UserUpdate)
async def update_user(request: Request, user_id: str, user: UserUpdate = Body(...)):
    user_data = jsonable_encoder(user)
    if user_data.get("password"):
        hashed_password = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt())
        user_data["password"] = hashed_password.decode('utf-8')
    user_data["updatedAt"] = datetime.utcnow()
    
    updated_user = await request.app.database["users"].update_one(
        {"_id": user_id}, {"$set": user_data}
    )
    
    if updated_user.modified_count == 1:
        updated_user_data = await request.app.database["users"].find_one({"_id": user_id})
        return updated_user_data
    
    raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")


@router.delete("/{id}", response_description="Delete a user")
async def delete_user(id: str, request: Request, response: Response):
    delete_result = await request.app.database["users"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")

#No hash
# @router.post("/", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
# async def create_user(request: Request, user: User = Body(...)):
#     user = jsonable_encoder(user)
#     new_user =  await request.app.database["users"].insert_one(user)
#     created_user = await request.app.database["users"].find_one(
#         {"_id": new_user.inserted_id}
#     )

#     return created_user

# @router.get("/", response_description="List all books", response_model=List[Book])
# def list_books(request: Request):
#     books = list(request.app.database["books"].find(limit=100))
#     return books