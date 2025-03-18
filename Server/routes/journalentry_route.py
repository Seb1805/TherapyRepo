from fastapi import APIRouter, Body, Request, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import JournalEntry, JournalEntryUpdate
import bcrypt
from .login import SECRET, ALGORITHM, oauth2_scheme
import jwt
import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()

    # # Update the patient's journal
    # patient_id = journal_entry_data["patientId"]
    # update_result = await request.app.database["patients"].update_one(
    #     {"_id": patient_id},
    #     {"$push": {"journal.entries": created_journal_entry["_id"]}}
    # )

    # if update_result.modified_count == 0:
    #     raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")
@router.post("/", response_description="Create a new journal entry", status_code=status.HTTP_201_CREATED, response_model=JournalEntry)
async def create_journal_entry(request: Request, journal_entry: JournalEntry = Body(...), token: str = Depends(oauth2_scheme)):
    # Find the therapist that is adding the new journal_entry
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        logging.log(payload)
        user_email: str = payload.get("sub")
        logging.debug(user_email)
        if user_email is None:
            logging.debug(payload)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError as e:
        logging.debug(f"Token decoding error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await request.app.data["users"].find_one({"email": user_email})
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Set the id of therapist before adding the journal_entry to database
    journal_entry_data = jsonable_encoder(journal_entry)
    journal_entry_data['therapistId'] = user['_id']

    # Get the patient id and remove it from the data that was sent to API
    patient_id: str = journal_entry_data['patient_id']
    del journal_entry_data['patient_id']

    # Add the journal_entry to database
    new_journal_entry = await request.app.database["journal_entries"].insert_one(journal_entry_data)
    created_journal_entry = await request.app.database["journal_entries"].find_one(
        {"_id": new_journal_entry.inserted_id}
    )

    # Update the patient document using $push to add the journal entry
    await request.app.database["patients"].update_one(
        {"_id": patient_id},
        {"$push": {"journal": created_journal_entry}}
    )

    return created_journal_entry
# @router.post("/", response_description="Create a new journal entry", status_code=status.HTTP_201_CREATED, response_model=JournalEntry)
# async def create_journal_entry(request: Request, token: str = Depends(oauth2_scheme),  journal_entry: JournalEntry = Body(...)):
#     #find the therapist that is adding the new journal_entry
#     try:
#         payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
#         user_email: str = payload.get("sub")
#         if user_email is None:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#     except jwt.PyJWTError:
#         print(payload)
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

#     user = await request.app.data["users"].find_one({"email": user_email})

#     # set the id of therapist before adding the journal_entry to database
#     journal_entry_data = jsonable_encoder(journal_entry)
#     setattr(journal_entry_data, 'therapistId', user._id)
    
#     # get the patient id and remove it from the data that was sent to api
#     patient_id: str = journal_entry_data.patient_id
#     del journal_entry_data.patient_id
    
#     # add the journal_entry to database
#     new_journal_entry = await request.app.database["journal_entries"].insert_one(journal_entry_data)
#     created_journal_entry = await request.app.database["journal_entries"].find_one(
#         {"_id": new_journal_entry.inserted_id}
#     )
    
#     # Update the patient document using $push to add the journal entry
#     await request.app.database["patients"].update_one(
#         {"_id": patient_id},
#         {"$push": {"journal": created_journal_entry}}
#     )

#     return created_journal_entry

@router.get("/{journal_entry_id}", response_description="Get a single journal entry", response_model=JournalEntry)
async def get_journal_entry(journal_entry_id: str, request: Request):
    journal_entry = await request.app.database["journal_entries"].find_one({"_id": journal_entry_id})
    if journal_entry is None:
        raise HTTPException(status_code=404, detail=f"Journal entry with ID {journal_entry_id} not found")
    return journal_entry

@router.get("/", response_description="List all journal entries", response_model=List[JournalEntry])
async def list_journal_entries(request: Request):
    journal_entries = await request.app.database["journal_entries"].find().to_list(length=100)
    return journal_entries

@router.put("/{journal_entry_id}", response_description="Update a journal entry", response_model=JournalEntry)
async def update_journal_entry(journal_entry_id: str, request: Request, journal_entry: JournalEntryUpdate = Body(...)):
    journal_entry_data = jsonable_encoder(journal_entry)
    journal_entry_data["updatedAt"] = datetime.utcnow()
    
    updated_journal_entry = await request.app.database["journal_entries"].update_one(
        {"_id": journal_entry_id}, {"$set": journal_entry_data}
    )
    
    if updated_journal_entry.modified_count == 1:
        updated_journal_entry_data = await request.app.database["journal_entries"].find_one({"_id": journal_entry_id})
        return updated_journal_entry_data
    
    raise HTTPException(status_code=404, detail=f"Journal entry with ID {journal_entry_id} not found")

@router.delete("/{journal_entry_id}", response_description="Delete a journal entry")
async def delete_journal_entry(journal_entry_id: str, request: Request):
    delete_result = await request.app.database["journal_entries"].delete_one({"_id": journal_entry_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Journal entry with ID {journal_entry_id} not found")
