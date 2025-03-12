import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def mongo_client():
    client = AsyncIOMotorClient("mongodb://localhost:8000/")
    yield client
    await client.close()

@pytest.fixture(scope="function")
async def test_db(mongo_client):
    db = mongo_client["test_database"]
    
    # Create collections
    await db.create_collection("users")
    
    yield db
    
    # Cleanup after tests
    await db.drop_collection("users")

@pytest.fixture(scope="function")
def client(test_db):
    app.dependency_overrides[get_database] = lambda: test_db
    
    with TestClient(app) as c:
        yield c
        
    app.dependency_overrides.clear()
