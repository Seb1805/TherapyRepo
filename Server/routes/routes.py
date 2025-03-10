from fastapi import APIRouter, Body, Request, Response, HTTPException, status,Depends
from fastapi.encoders import jsonable_encoder
from typing import List
from models import PatientExercise
from database import get_database
from models import Book, BookUpdate
from datetime import datetime
from dependencies import get_current_user
from models import User

router = APIRouter()

@router.post("/", response_description="Create a new book", status_code=status.HTTP_201_CREATED, response_model=Book)
def create_book(request: Request, book: Book = Body(...)):
    book = jsonable_encoder(book)
    new_book = request.app.database["books"].insert_one(book)
    created_book = request.app.database["books"].find_one(
        {"_id": new_book.inserted_id}
    )

    return created_book

@router.get("/", response_description="List all books", response_model=List[Book])
def list_books(request: Request):
    books = list(request.app.database["books"].find(limit=100))
    return books

@router.get("/skrald")
async def addTrashData(current_user: User = Depends(get_current_user)):
    # Create an instance of PatientExercise
    patient_exercise = PatientExercise(
        patientId="patient123",
        patientInfo={},
        exerciseId="exercise123",
        exerciseInfo={},
        journalEntryId="journalEntry123",
        assignedBy="therapist123",
        assignedByName="John Doe",
        assignedDate=datetime(2023, 1, 1),
        prescription={},
        notes="Exercise notes...",
        createdAt=datetime(2023, 1, 1),
        updatedAt=datetime(2023, 1, 1)
    )
    db = get_database()  # Call the function to get the database object
    # Insert the document into MongoDB
    result = await db['patientExercise'].insert_one(patient_exercise.dict(by_alias=True))
    # Extract the inserted ID
    inserted_id = result.inserted_id
    return {"inserted_id": str(inserted_id)}

@router.get("/{id}", response_description="Get a single book by id", response_model=Book)
def find_book(id: str, request: Request):
    if (book := request.app.database["books"].find_one({"_id": id})) is not None:
        return book
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")

@router.put("/{id}", response_description="Update a book", response_model=Book)
def update_book(id: str, request: Request, book: BookUpdate = Body(...)):
    book = {k: v for k, v in book.dict().items() if v is not None}
    if len(book) >= 1:
        update_result = request.app.database["books"].update_one(
            {"_id": id}, {"$set": book}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")

    if (
        existing_book := request.app.database["books"].find_one({"_id": id})
    ) is not None:
        return existing_book

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")

@router.delete("/{id}", response_description="Delete a book")
def delete_book(id: str, request: Request, response: Response):
    delete_result = request.app.database["books"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")


    #db.collection.insert_one(patient_exercise.dict(by_alias=True))

