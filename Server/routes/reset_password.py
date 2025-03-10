from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from typing import Optional
from fastapi_mail import FastMail, MessageSchema
from fastapi_mail.email_utils import DefaultChecker

class PasswordResetRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    token: str
    new_password: str

router = APIRouter()

def create_reset_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
        to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def send_reset_email(email_to: str, reset_url: str):
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email_to],
        template_body={"reset_url": reset_url},
        subtype="html"
    )
    fm = FastMail(settings.EMAIL_CONFIG)
    await fm.send_message(message, template_name="password_reset.html")

@router.post("/reset-password", response_description="Request password reset")
async def request_password_reset(
    reset_request: PasswordResetRequest,
    request: Request,
    fm: FastMail = FastMail(settings.EMAIL_CONFIG)
):
    user = await request.app.database["users"].find_one({"email": reset_request.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    reset_token = create_reset_token(
        {"user_id": str(user["_id"])},
        expires_delta=timedelta(minutes=30)
    )
    
    reset_url = f"{request.url.scheme}://{request.url.netloc}/reset-password/{reset_token}"
    await send_reset_email(reset_request.email, reset_url)
    
    return {"message": "Password reset email sent successfully"}

@router.post("/reset-password/{token}", response_description="Reset password")
async def reset_password(
    token: str,
    password_reset: PasswordReset,
    request: Request
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
        
        if "exp" in payload and datetime.utcnow() > payload["exp"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token has expired"
            )
        
        user = await request.app.database["users"].find_one({"_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        hashed_password = bcrypt.hashpw(
            password_reset.new_password.encode('utf-8'),
            bcrypt.gensalt()
        )
        
        await request.app.database["users"].update_one(
            {"_id": user_id},
            {"$set": {"password": hashed_password.decode('utf-8')}}
        )
        
        return {"message": "Password reset successfully"}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
        
        
##########################
# from fastapi import APIRouter, HTTPException, status
# from datetime import datetime, timedelta
# from typing import Optional

# router = APIRouter()

# @router.post("/reset-password", response_description="Request password reset")
# async def request_password_reset(
#     email: str,
#     request: Request
# ):
#     user = await request.app.database["users"].find_one({"email": email})
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )
    
#     # Simple token generation
#     token = f"{user['_id']}-{datetime.utcnow().isoformat()}"
#     await request.app.database["password_reset_tokens"].insert_one({
#         "user_id": user["_id"],
#         "token": token,
#         "expires_at": datetime.utcnow() + timedelta(minutes=30)
#     })
    
#     # In production, you would send an email here
#     return {"token": token}

# @router.post("/reset-password/{token}", response_description="Reset password")
# async def reset_password(
#     token: str,
#     new_password: str,
#     request: Request
# ):
#     reset_token = await request.app.database["password_reset_tokens"].find_one(
#         {"token": token}
#     )
    
#     if not reset_token:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid token"
#         )
    
#     if datetime.utcnow() > reset_token["expires_at"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Token has expired"
#         )
    
#     user_id = reset_token["user_id"]
#     user = await request.app.database["users"].find_one({"_id": user_id})
    
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )
    
#     hashed_password = bcrypt.hashpw(
#         new_password.encode('utf-8'),
#         bcrypt.gensalt()
#     )
    
#     await request.app.database["users"].update_one(
#         {"_id": user_id},
#         {"$set": {"password": hashed_password.decode('utf-8')}}
#     )
    
#     await request.app.database["password_reset_tokens"].delete_one(
#         {"token": token}
#     )
    
#     return {"message": "Password reset successfully"}