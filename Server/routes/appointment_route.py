from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import Appointment, AppointmentUpdate


router = APIRouter()

@router.post("/", response_description="Create a new appointment", status_code=status.HTTP_201_CREATED, response_model=Appointment)
async def create_appointment(request: Request, appointment: Appointment = Body(...)):
    appointment_data = jsonable_encoder(appointment)
    new_appointment = await request.app.database["appointments"].insert_one(appointment_data)
    created_appointment = await request.app.database["appointments"].find_one(
        {"_id": new_appointment.inserted_id}
    )

    return created_appointment
@router.post("/users")
async def list_patients( request: Request,  user_ids: List[dict]):
    user_ids = [user["_id"] for user in user_ids]

    appointments = await request.app.database["appointments"].find({"therapistId": {"$in": user_ids}}).to_list(length=100)
    return appointments

@router.get("/", response_description="List all appointments", response_model=List[Appointment])
async def list_appointments(request: Request):
    appointments = await request.app.database["appointments"].find().to_list(length=100)
    return appointments

@router.put("/{appointment_id}", response_description="Update an appointment", response_model=Appointment)
async def update_appointment(appointment_id: str, request: Request, appointment: AppointmentUpdate = Body(...)):
    appointment_data = jsonable_encoder(appointment)
    appointment_data["updatedAt"] = datetime.utcnow()
    
    updated_appointment = await request.app.database["appointments"].update_one(
        {"_id": appointment_id}, {"$set": appointment_data}
    )
    
    if updated_appointment.modified_count == 1:
        updated_appointment_data = await request.app.database["appointments"].find_one({"_id": appointment_id})
        return updated_appointment_data
    
    raise HTTPException(status_code=404, detail=f"Appointment with ID {appointment_id} not found")

@router.delete("/{appointment_id}", response_description="Delete an appointment")
async def delete_appointment(appointment_id: str, request: Request):
    delete_result = await request.app.database["appointments"].delete_one({"_id": appointment_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Appointment with ID {appointment_id} not found")

@router.get("/between_dates/", response_description="Get appointments between two dates", response_model=List[Appointment])
async def get_appointments_between_dates(start_date: datetime, end_date: datetime, request: Request):
    appointments = await request.app.database["appointments"].find({
        "startTime": {"$gte": start_date},
        "endTime": {"$lte": end_date}
    }).to_list(length=100)
    
    return appointments

@router.get("/{appointment_id}", response_description="Get a single appointment", response_model=Appointment)
async def get_appointment(appointment_id: str, request: Request):
    appointment = await request.app.database["appointments"].find_one({"_id": appointment_id})
    if appointment is None:
        raise HTTPException(status_code=404, detail=f"Appointment with ID {appointment_id} not found")
    return appointment
