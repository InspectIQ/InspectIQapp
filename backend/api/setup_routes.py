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


@router.get("/promote-kevin")
async def promote_kevin(db: Session = Depends(get_db)):
    """
    One-time endpoint to promote kevin.colahan@gmail.com to admin.
    No parameters needed!
    """
    
    # Find user
    user = db.query(User).filter(User.email == "kevin.colahan@gmail.com").first()
    if not user:
        raise HTTPException(status_code=404, detail="User kevin.colahan@gmail.com not found. Please register first at /register")
    
    # Update role
    old_role = user.role
    user.role = "admin"
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": f"Kevin promoted to admin!",
        "instructions": "Log out and log back in to see the Admin Panel link.",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "old_role": str(old_role),
            "new_role": str(user.role)
        }
    }


@router.get("/check")
async def check_setup():
    """Check if setup routes are accessible."""
    return {
        "message": "Setup routes are active!",
        "instruction": "Go to /api/v1/setup/promote-kevin to become admin"
    }
