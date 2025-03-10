from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import Service, ServiceUpdate

router = APIRouter()

@router.post("/", response_description="Create a new service", status_code=status.HTTP_201_CREATED, response_model=Service)
async def create_service(request: Request, service: Service = Body(...)):
    service_data = jsonable_encoder(service)
    new_service = await request.app.database["services"].insert_one(service_data)
    created_service = await request.app.database["services"].find_one(
        {"_id": new_service.inserted_id}
    )

    return created_service

@router.get("/{service_id}", response_description="Get a single service", response_model=Service)
async def get_service(service_id: str, request: Request):
    service = await request.app.database["services"].find_one({"_id": service_id})
    if service is None:
        raise HTTPException(status_code=404, detail=f"Service with ID {service_id} not found")
    return service

@router.get("/", response_description="List all services", response_model=List[Service])
async def list_services(request: Request):
    services = await request.app.database["services"].find().to_list(length=100)
    return services

@router.put("/{service_id}", response_description="Update a service", response_model=Service)
async def update_service(service_id: str, request: Request, service: ServiceUpdate = Body(...)):
    service_data = jsonable_encoder(service)
    service_data["updatedAt"] = datetime.utcnow()
    
    updated_service = await request.app.database["services"].update_one(
        {"_id": service_id}, {"$set": service_data}
    )
    
    if updated_service.modified_count == 1:
        updated_service_data = await request.app.database["services"].find_one({"_id": service_id})
        return updated_service_data
    
    raise HTTPException(status_code=404, detail=f"Service with ID {service_id} not found")

@router.delete("/{service_id}", response_description="Delete a service")
async def delete_service(service_id: str, request: Request):
    delete_result = await request.app.database["services"].delete_one({"_id": service_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Service with ID {service_id} not found")