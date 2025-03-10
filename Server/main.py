from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

from routes.routes import router as book_router
from routes.user_route import router as user_router
from routes.login import router as login_router
from routes.patient_route import router as patient_router
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
