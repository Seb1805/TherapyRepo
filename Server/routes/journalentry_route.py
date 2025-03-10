from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import JournalEntry, JournalEntryUpdate

router = APIRouter()

@router.post("/", response_description="Create a new journal entry", status_code=status.HTTP_201_CREATED, response_model=JournalEntry)
async def create_journal_entry(request: Request, journal_entry: JournalEntry = Body(...)):
    journal_entry_data = jsonable_encoder(journal_entry)
    new_journal_entry = await request.app.database["journal_entries"].insert_one(journal_entry_data)
    created_journal_entry = await request.app.database["journal_entries"].find_one(
        {"_id": new_journal_entry.inserted_id}
    )

    return created_journal_entry

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