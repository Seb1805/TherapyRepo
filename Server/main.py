from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

#Routes
from routes.routes import router as book_router
from routes.user_route import router as user_router
from routes.login import router as login_router
from routes.patient_route import router as patient_router
from routes.invoice_route import router as invoice_router
from routes.journalentry_route import router as journalentry_router
from routes.appointment_route import router as appointment_router
from routes.service_route import router as service_router
from routes.excercise_route import router as excercise_router
from routes.clinic_route import router as clinic_router

from motor.motor_asyncio import AsyncIOMotorClient
from bson.codec_options import CodecOptions, UuidRepresentation

config = dotenv_values(".env")

app = FastAPI()

origins = [
    "http://localhost:3000",  # Your Next.js frontend
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    #app.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.mongodb_client = AsyncIOMotorClient(config["ATLAS_URI"], uuidRepresentation='standard')
    app.database = app.mongodb_client[config["DB_NAME"]]

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

#Register a route
app.include_router(book_router, tags=["books"], prefix="/book")
app.include_router(user_router,tags=["users"],prefix="/user")
app.include_router(login_router, tags=["auth"], prefix="/auth")
app.include_router(patient_router,tags=["patients"],prefix="/patient")
app.include_router(invoice_router,tags=["invoices"],prefix="/invoice")
app.include_router(journalentry_router,tags=["journal_entries"],prefix="/journal_entry")
app.include_router(appointment_router,tags=["appointments"],prefix="/appointment")
app.include_router(service_router,tags=["services"],prefix="/service")
app.include_router(excercise_router,tags=["excercises"],prefix="/excercise")
app.include_router(clinic_router,tags=["clnics"], prefix="/clinic")

