"""
Temporary setup routes for initial admin creation.
REMOVE THIS FILE after creating your first admin!
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.database.models import User
from pydantic import BaseModel
import os

router = APIRouter(prefix="/setup", tags=["setup"])

# Secret key to protect this endpoint
SETUP_SECRET = os.getenv("SETUP_SECRET", "change-this-secret-key-in-production")


class PromoteAdminRequest(BaseModel):
    email: str
    secret: str


@router.post("/promote-admin")
async def promote_admin(request: PromoteAdminRequest, db: Session = Depends(get_db)):
    """
    Promote a user to admin role.
    This is a temporary endpoint for initial setup.
    DELETE THIS ROUTE after creating your first admin!
    """
    
    # Check secret key
    if request.secret != SETUP_SECRET:
        raise HTTPException(status_code=403, detail="Invalid setup secret")
    
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with email '{request.email}' not found")
    
    # Update role
    old_role = user.role
    user.role = "admin"
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": f"User '{user.email}' promoted to admin",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "old_role": old_role,
            "new_role": user.role
        }
    }


@router.get("/check")
async def check_setup():
    """Check if setup routes are accessible."""
    return {
        "message": "Setup routes are active",
        "warning": "Remember to remove these routes after creating your first admin!"
    }


@router.get("/promote-admin-simple")
async def promote_admin_simple(email: str, secret: str, db: Session = Depends(get_db)):
    """
    Simple GET endpoint to promote a user to admin.
    Use: /api/v1/setup/promote-admin-simple?email=YOUR_EMAIL&secret=SECRET
    """
    
    # Check secret key
    if secret != SETUP_SECRET:
        raise HTTPException(status_code=403, detail="Invalid setup secret")
    
    # Find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with email '{email}' not found. Please register first.")
    
    # Update role
    old_role = user.role
    user.role = "admin"
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": f"User '{user.email}' promoted to admin!",
        "instructions": "Log out and log back in to see the Admin Panel link.",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "old_role": str(old_role),
            "new_role": str(user.role)
        }
    }
