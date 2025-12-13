from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import secrets
import hashlib
from backend.database.database import get_db
from backend.database.models import User
from backend.schemas.user import UserCreate, UserResponse, Token, UserLogin
# Temporarily removed: PasswordResetRequest, PasswordReset
from backend.auth.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_active_user
)
from config.settings import get_settings

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = User(
        email=user.email,
        name=user.name,
        hashed_password=get_password_hash(user.password),
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/json", response_model=Token)
async def login_json(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login with JSON body (for frontend)."""
    user = db.query(User).filter(User.email == user_login.email).first()
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user


@router.get("/test-endpoints")
async def test_endpoints():
    """Test which endpoints are available."""
    return {
        "available_endpoints": [
            "/register",
            "/login", 
            "/login/json",
            "/me",
            "/test-migration",
            "/test-endpoints",
            "/forgot-password",
            "/reset-password"
        ],
        "message": "All auth endpoints should be available"
    }

@router.get("/test-migration")
async def test_migration(db: Session = Depends(get_db)):
    """Test if database migration worked."""
    try:
        # Try to query a user and check if reset fields exist
        user = db.query(User).first()
        if user:
            # Check if the new fields exist
            has_reset_fields = hasattr(user, 'reset_token_hash') and hasattr(user, 'reset_token_expires')
            return {
                "migration_status": "success" if has_reset_fields else "missing_fields",
                "reset_fields_exist": has_reset_fields,
                "user_count": db.query(User).count()
            }
        else:
            return {
                "migration_status": "no_users",
                "reset_fields_exist": False,
                "user_count": 0
            }
    except Exception as e:
        return {
            "migration_status": "error",
            "error": str(e),
            "reset_fields_exist": False
        }


# @router.post("/forgot-password")
# async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Request password reset."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a password reset link has been sent."}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    reset_token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
    
    # Store token hash and expiry (24 hours from now)
    user.reset_token_hash = reset_token_hash
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
    db.commit()
    
    # In a real app, you would send an email here
    # For now, we'll just return the token for testing
    return {
        "message": "If the email exists, a password reset link has been sent.",
        "reset_token": reset_token  # Remove this in production
    }


# @router.post("/reset-password")
# async def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    """Reset password with token."""
    # Hash the provided token
    token_hash = hashlib.sha256(request.token.encode()).hexdigest()
    
    # Find user with matching token
    user = db.query(User).filter(
        User.reset_token_hash == token_hash,
        User.reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password and clear reset token
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_token_hash = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password has been reset successfully"}
