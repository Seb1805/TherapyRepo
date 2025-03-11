import pytest
from fastapi import status
from routes.user_router import User, UserUpdate
from tests.factories.user_factory import create_user

@pytest.mark.asyncio
async def test_create_user(client):
    user_data = {
        "email": "test@example.com",
        "password": "test_password",
        "role": "therapist",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890",
        "specialties": ["therapy"],
        "services": ["consultation"],
        "active": True,
    }
    
    response = client.post("/", json=user_data)
    assert response.status_code == status.HTTP_201_CREATED
    result = User.parse_obj(response.json())
    
    assert result.email == user_data["email"]
    assert result.role == user_data["role"]
    assert result.firstName == user_data["firstName"]
    assert result.lastName == user_data["lastName"]

@pytest.mark.asyncio
async def test_create_user_invalid_email(client):
    user_data = {
        "email": "invalid-email",
        "password": "test_password",
        "role": "therapist",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890",
        "specialties": ["therapy"],
        "services": ["consultation"],
        "active": True,
    }
    
    response = client.post("/", json=user_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

@pytest.mark.asyncio
async def test_update_user(test_db, client):
    existing_user = await create_user(test_db)
    
    update_data = {
        "firstName": "Updated Name",
        "lastName": "Updated Lastname",
        "specialties": ["new_specialty"],
    }
    
    response = client.put(f"/update_user/{existing_user['_id']}", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    
    updated_user = User.parse_obj(response.json())
    assert updated_user.firstName == update_data["firstName"]
    assert updated_user.lastName == update_data["lastName"]

@pytest.mark.asyncio
async def test_update_nonexistent_user(client):
    response = client.put("/update_user/nonexistent_id", json={})
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_delete_user(test_db, client):
    user = await create_user(test_db)
    
    response = client.delete(f"/{user['_id']}")
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify user is deleted
    response = client.get(f"/{user['_id']}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_get_user(test_db, client):
    user = await create_user(test_db)
    
    response = client.get(f"/{user['_id']}")
    assert response.status_code == status.HTTP_200_OK
    
    result = User.parse_obj(response.json())
    assert result.email == user["email"]
    assert result.role == user["role"]

@pytest.mark.asyncio
async def test_list_users(test_db, client):
    # Create multiple users
    await create_user(test_db)
    await create_user(test_db)
    
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    
    result = [User.parse_obj(user) for user in response.json()]
    assert len(result) >= 2
