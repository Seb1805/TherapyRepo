from fastapi import APIRouter, Body, Request, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import Patient, PatientUpdate
from pydantic import BaseModel

router = APIRouter()

@router.post("/", response_description="Create a new patient", status_code=status.HTTP_201_CREATED, response_model=Patient)
async def create_patient(request: Request, patient: Patient = Body(...)):
    patient_data = jsonable_encoder(patient)
    new_patient = await request.app.database["patients"].insert_one(patient_data)
    created_patient = await request.app.database["patients"].find_one(
        {"_id": new_patient.inserted_id}
    )

    return created_patient

class PatientFilter(BaseModel):
    journalNumber: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    cpr: str | None = None
#/patients/?cpr=120499-1849&firstname=morten
@router.get("/search", response_description="List patients matching filter", response_model=List[Patient])
async def list_patients(
    request: Request,
    filter_params: PatientFilter = Depends()
):
    # Convert Pydantic model to MongoDB filter
    mongo_filter = {k: v for k, v in filter_params.dict(exclude_none=True).items()}
    #print(mongo_filter)
    patients = await request.app.database["patients"].find(mongo_filter).to_list(length=100)
    return patients
#Post can be used with json body
@router.post("/search", response_description="List patients matching filter", response_model=List[Patient])
async def list_patients(
    request: Request,
    filter_params: PatientFilter
):
    # Convert Pydantic model to MongoDB filter
        # Convert Pydantic model to MongoDB filter
    mongo_filter = {}
    for k, v in filter_params.dict(exclude_none=True).items():
        if isinstance(v, str):
            mongo_filter[k] = {"$regex": f"^{v}$", "$options": "i"}
        else:
            mongo_filter[k] = v
    #mongo_filter = {k: v for k, v in filter_params.dict(exclude_none=True).items()}
    
    patients = await request.app.database["patients"].find(mongo_filter).to_list(length=100)
    return patients



@router.get("/", response_description="List all patients", response_model=List[Patient])
async def list_patients(request: Request):
    patients = await request.app.database["patients"].find().to_list(length=100)
    return patients




@router.put("/{patient_id}", response_description="Update a patient", response_model=Patient)
async def update_patient(patient_id: str, request: Request, patient: PatientUpdate = Body(...)):
    patient_data = jsonable_encoder(patient)
    patient_data["updatedAt"] = datetime.utcnow()
    
    updated_patient = await request.app.database["patients"].update_one(
        {"_id": patient_id}, {"$set": patient_data}
    )
    
    if updated_patient.modified_count == 1:
        updated_patient_data = await request.app.database["patients"].find_one({"_id": patient_id})
        return updated_patient_data
    
    raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")

@router.delete("/{patient_id}", response_description="Delete a patient")
async def delete_patient(patient_id: str, request: Request):
    delete_result = await request.app.database["patients"].delete_one({"_id": patient_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")

@router.get("/{patient_id}", response_description="Get a single patient", response_model=Patient)
async def get_patient(patient_id: str, request: Request):
    patient = await request.app.database["patients"].find_one({"_id": patient_id})
    if patient is None:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")
    return patient