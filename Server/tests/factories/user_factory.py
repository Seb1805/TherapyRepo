from faker import Faker
from .routes.user_router import User

fake = Faker()

def create_user_data(**overrides):
    base_data = {
        "email": fake.email(),
        "password": "test_password",
        "role": "therapist",
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "phoneNumber": fake.phone_number(),
        "specialties": [fake.word() for _ in range(2)],
        "services": [fake.word() for _ in range(2)],
        "active": True,
    }
    base_data.update(overrides)
    return User(**base_data)

async def create_user(test_db, **overrides):
    user_data = create_user_data(**overrides)
    result = await test_db["users"].insert_one(user_data.dict())
    return await test_db["users"].find_one({"_id": result.inserted_id})
