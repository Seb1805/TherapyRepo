from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
from typing import List
from datetime import datetime
from models import Invoice, InvoiceUpdate

router = APIRouter()

@router.post("/", response_description="Create a new invoice", status_code=status.HTTP_201_CREATED, response_model=Invoice)
async def create_invoice(request: Request, invoice: Invoice = Body(...)):
    invoice_data = jsonable_encoder(invoice)
    new_invoice = await request.app.database["invoices"].insert_one(invoice_data)
    created_invoice = await request.app.database["invoices"].find_one(
        {"_id": new_invoice.inserted_id}
    )

    return created_invoice

@router.get("/{invoice_id}", response_description="Get a single invoice", response_model=Invoice)
async def get_invoice(invoice_id: str, request: Request):
    invoice = await request.app.database["invoices"].find_one({"_id": invoice_id})
    if invoice is None:
        raise HTTPException(status_code=404, detail=f"Invoice with ID {invoice_id} not found")
    return invoice

@router.get("/", response_description="List all invoices", response_model=List[Invoice])
async def list_invoices(request: Request):
    invoices = await request.app.database["invoices"].find().to_list(length=100)
    return invoices

@router.put("/{invoice_id}", response_description="Update an invoice", response_model=Invoice)
async def update_invoice(invoice_id: str, request: Request, invoice: InvoiceUpdate = Body(...)):
    invoice_data = jsonable_encoder(invoice)
    invoice_data["updatedAt"] = datetime.utcnow()
    
    updated_invoice = await request.app.database["invoices"].update_one(
        {"_id": invoice_id}, {"$set": invoice_data}
    )
    
    if updated_invoice.modified_count == 1:
        updated_invoice_data = await request.app.database["invoices"].find_one({"_id": invoice_id})
        return updated_invoice_data
    
    raise HTTPException(status_code=404, detail=f"Invoice with ID {invoice_id} not found")

@router.delete("/{invoice_id}", response_description="Delete an invoice")
async def delete_invoice(invoice_id: str, request: Request):
    delete_result = await request.app.database["invoices"].delete_one({"_id": invoice_id})
    
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail=f"Invoice with ID {invoice_id} not found")