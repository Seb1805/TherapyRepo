from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import ClinicSettings, ClinicSettingsUpdate

router = APIRouter()

@router.post("/", response_description="Create a new clinic setting", status_code=status.HTTP_201_CREATED, response_model=ClinicSettings)
async def create_clinic_settings(request: Request, clinic_settings: ClinicSettings = Body(...)):
    clinic_settings_data = jsonable_encoder(clinic_settings)
    new_clinic_settings = await request.app.database["clinic_settings"].insert_one(clinic_settings_data)
    created_clinic_settings = await request.app.database["clinic_settings"].find_one(
        {"_id": new_clinic_settings.inserted_id}
    )

    return created_clinic_settings

@router.get("/{clinic_settings_id}", response_description="Get a single clinic setting", response_model=ClinicSettings)
async def get_clinic_settings(clinic_settings_id: str, request: Request):
    clinic_settings = await request.app.database["clinic_settings"].find_one({"_id": clinic_settings_id})
    if clinic_settings is None:
        raise HTTPException(status_code=404, detail=f"Clinic settings with ID {clinic_settings_id} not found")
    return clinic_settings

@router.get("/", response_description="List all clinic settings", response_model=List[ClinicSettings])
async def list_clinic_settings(request: Request):
    clinic_settings = await request.app.database["clinic_settings"].find().to_list(length=100)
    return clinic_settings

@router.put("/{clinic_settings_id}", response_description="Update a clinic setting", response_model=ClinicSettings)
async def update_clinic_settings(clinic_settings_id: str, request: Request, clinic_settings: ClinicSettingsUpdate = Body(...)):
    clinic_settings_data = jsonable_encoder(clinic_settings)
    clinic_settings_data["updatedAt"] = datetime.utcnow()
    
    updated_clinic_settings = await request.app.database["clinic_settings"].update_one(
        {"_id": clinic_settings_id}, {"$set": clinic_settings_data}
    )
    
    if updated_clinic_settings.modified_count == 1:
        updated_clinic_settings_data = await request.app.database["clinic_settings"].find_one({"_id": clinic_settings_id})
        return updated_clinic_settings_data
    
    raise HTTPException(status_code=404, detail=f"Clinic settings with ID {clinic_settings_id} not found")

@router.delete("/{clinic_settings_id}", response_description="Delete a clinic setting")
async def delete_clinic_settings(clinic_settings_id: str, request: Request):
    delete_result = await request.app.database["clinic_settings"].delete_one({"_id": clinic_settings_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Clinic settings with ID {clinic_settings_id} not found")