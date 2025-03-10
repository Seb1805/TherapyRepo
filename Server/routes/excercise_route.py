from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import Exercise, ExerciseUpdate

router = APIRouter()

@router.post("/", response_description="Create a new exercise", status_code=status.HTTP_201_CREATED, response_model=Exercise)
async def create_exercise(request: Request, exercise: Exercise = Body(...)):
    exercise_data = jsonable_encoder(exercise)
    new_exercise = await request.app.database["exercises"].insert_one(exercise_data)
    created_exercise = await request.app.database["exercises"].find_one(
        {"_id": new_exercise.inserted_id}
    )

    return created_exercise

@router.get("/{exercise_id}", response_description="Get a single exercise", response_model=Exercise)
async def get_exercise(exercise_id: str, request: Request):
    exercise = await request.app.database["exercises"].find_one({"_id": exercise_id})
    if exercise is None:
        raise HTTPException(status_code=404, detail=f"Exercise with ID {exercise_id} not found")
    return exercise

@router.get("/", response_description="List all exercises", response_model=List[Exercise])
async def list_exercises(request: Request):
    exercises = await request.app.database["exercises"].find().to_list(length=100)
    return exercises

@router.put("/{exercise_id}", response_description="Update an exercise", response_model=Exercise)
async def update_exercise(exercise_id: str, request: Request, exercise: ExerciseUpdate = Body(...)):
    exercise_data = jsonable_encoder(exercise)
    exercise_data["updatedAt"] = datetime.utcnow()
    
    updated_exercise = await request.app.database["exercises"].update_one(
        {"_id": exercise_id}, {"$set": exercise_data}
    )
    
    if updated_exercise.modified_count == 1:
        updated_exercise_data = await request.app.database["exercises"].find_one({"_id": exercise_id})
        return updated_exercise_data
    
    raise HTTPException(status_code=404, detail=f"Exercise with ID {exercise_id} not found")

@router.delete("/{exercise_id}", response_description="Delete an exercise")
async def delete_exercise(exercise_id: str, request: Request):
    delete_result = await request.app.database["exercises"].delete_one({"_id": exercise_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Exercise with ID {exercise_id} not found")