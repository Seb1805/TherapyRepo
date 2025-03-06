from fastapi import Depends, HTTPException, status,Request
from fastapi.security import OAuth2PasswordBearer
import jwt

SECRET = "min-hemmelige-nøgle" 
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = await get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

async def get_user_by_email(request: Request,email: str):
    # Replace with your database query to get the user by email
    user = await request.app.database["users"].find_one({"email": email})
    return user