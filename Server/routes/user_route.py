from fastapi import APIRouter, Body, Request, Response, HTTPException, status,Depends
from fastapi.encoders import jsonable_encoder
from typing import List
from models import PatientExercise
from database import get_database
from models import User, UserUpdate
from datetime import datetime
import bcrypt
from .login import SECRET, ALGORITHM, oauth2_scheme
from bson import ObjectId
import jwt
from uuid import UUID




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



@router.get("/", response_description="List all users", response_model=List[User])
async def list_users(request: Request):
        #appointments = await request.app.database["appointments"].find().to_list(length=100)

    users = await request.app.database["users"].find().to_list(length=100)
    return users


@router.get("/users_by_clinic", response_description="List all users by clinic", response_model=List[User])
async def list_users_by_clinic(request: Request, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        clinic_id: str = payload.get("clinicId")
        if clinic_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Convert the clinic_id to UUID
    try:
        clinic_uuid = clinic_id
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid UUID format")

    # Query MongoDB using the UUID directly
    users = await request.app.database["users"].find({"clinicId": clinic_uuid}).to_list(length=100)
    return users


@router.get("/{id}", response_description="Get a single user by id", response_model=User)
async def find_user(id: str, request: Request):
       # appointment = await request.app.database["appointments"].find_one({"_id": appointment_id})
    user = await request.app.database["users"].find_one({"_id": id})
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")
    return user 

# @router.get("/", response_description="List all users", response_model=List[User])
# def list_users(request: Request):
#     users = list(request.app.database["users"].find_all())
#     return users




#No hash
# @router.post("/", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
# async def create_user(request: Request, user: User = Body(...)):
#     user = jsonable_encoder(user)
#     new_user =  await request.app.database["users"].insert_one(user)
#     created_user = await request.app.database["users"].find_one(
#         {"_id": new_user.inserted_id}
#     )

#     return created_user
