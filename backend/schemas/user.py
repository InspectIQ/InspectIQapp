from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from backend.database.models import UserRole, SubscriptionTier


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.OWNER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    subscription_tier: SubscriptionTier
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
