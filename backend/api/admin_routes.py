from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Optional
from backend.database.database import get_db
from backend.database.models import User, Property, Inspection, Room, Photo
from backend.auth.auth import get_current_active_user, require_admin
from backend.schemas.admin import (
    DashboardStats,
    UserListResponse,
    UserDetailResponse,
    InspectionAnalytics,
    PropertyAnalytics,
    SystemMetrics,
    ActivityLog
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get dashboard overview statistics."""
    
    # Total counts
    total_users = db.query(func.count(User.id)).scalar()
    total_properties = db.query(func.count(Property.id)).scalar()
    total_inspections = db.query(func.count(Inspection.id)).scalar()
    total_photos = db.query(func.count(Photo.id)).scalar()
    
    # Active users (logged in last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = db.query(func.count(User.id)).filter(
        User.created_at >= thirty_days_ago
    ).scalar()
    
    # Inspections by status
    completed_inspections = db.query(func.count(Inspection.id)).filter(
        Inspection.status == "completed"
    ).scalar()
    
    pending_inspections = db.query(func.count(Inspection.id)).filter(
        Inspection.status == "pending"
    ).scalar()
    
    # Recent activity (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = db.query(func.count(User.id)).filter(
        User.created_at >= seven_days_ago
    ).scalar()
    
    new_inspections_week = db.query(func.count(Inspection.id)).filter(
        Inspection.created_at >= seven_days_ago
    ).scalar()
    
    # Average inspections per user
    avg_inspections = total_inspections / total_users if total_users > 0 else 0
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_properties": total_properties,
        "total_inspections": total_inspections,
        "completed_inspections": completed_inspections,
        "pending_inspections": pending_inspections,
        "total_photos": total_photos,
        "new_users_this_week": new_users_week,
        "new_inspections_this_week": new_inspections_week,
        "avg_inspections_per_user": round(avg_inspections, 2)
    }


@router.get("/users", response_model=List[UserListResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get list of all users with filtering."""
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | 
            (User.name.ilike(f"%{search}%"))
        )
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    
    # Add inspection count for each user
    result = []
    for user in users:
        inspection_count = db.query(func.count(Inspection.id)).join(
            Property
        ).filter(Property.owner_id == user.id).scalar()
        
        property_count = db.query(func.count(Property.id)).filter(
            Property.owner_id == user.id
        ).scalar()
        
        result.append({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "property_count": property_count,
            "inspection_count": inspection_count
        })
    
    return result


@router.get("/users/{user_id}", response_model=UserDetailResponse)
async def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get detailed information about a specific user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's properties
    properties = db.query(Property).filter(Property.owner_id == user_id).all()
    
    # Get user's inspections
    inspections = db.query(Inspection).join(Property).filter(
        Property.owner_id == user_id
    ).order_by(desc(Inspection.created_at)).limit(10).all()
    
    # Calculate stats
    total_photos = db.query(func.count(Photo.id)).join(Room).join(Inspection).join(
        Property
    ).filter(Property.owner_id == user_id).scalar()
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "properties": properties,
        "recent_inspections": inspections,
        "total_photos": total_photos
    }


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update a user's role."""
    if role not in ["user", "inspector", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role
    db.commit()
    
    return {"message": "User role updated successfully", "user_id": user_id, "new_role": role}


@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Activate or deactivate a user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = is_active
    db.commit()
    
    return {"message": "User status updated successfully", "user_id": user_id, "is_active": is_active}


@router.get("/analytics/inspections", response_model=InspectionAnalytics)
async def get_inspection_analytics(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get inspection analytics for the specified time period."""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Inspections over time
    inspections_by_day = db.query(
        func.date(Inspection.created_at).label('date'),
        func.count(Inspection.id).label('count')
    ).filter(
        Inspection.created_at >= start_date
    ).group_by(
        func.date(Inspection.created_at)
    ).all()
    
    # Status breakdown
    status_counts = db.query(
        Inspection.status,
        func.count(Inspection.id)
    ).group_by(Inspection.status).all()
    
    # Average completion time (mock for now)
    avg_completion_time = 45  # minutes
    
    return {
        "total_inspections": sum(count for _, count in inspections_by_day),
        "inspections_by_day": [
            {"date": str(date), "count": count} 
            for date, count in inspections_by_day
        ],
        "status_breakdown": {status: count for status, count in status_counts},
        "avg_completion_time_minutes": avg_completion_time
    }


@router.get("/analytics/properties", response_model=PropertyAnalytics)
async def get_property_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get property analytics."""
    
    # Properties by type
    type_counts = db.query(
        Property.property_type,
        func.count(Property.id)
    ).group_by(Property.property_type).all()
    
    # Properties by state/location
    location_counts = db.query(
        Property.state,
        func.count(Property.id)
    ).filter(
        Property.state.isnot(None)
    ).group_by(Property.state).order_by(
        desc(func.count(Property.id))
    ).limit(10).all()
    
    # Average property age (mock)
    avg_age = 25
    
    return {
        "total_properties": db.query(func.count(Property.id)).scalar(),
        "properties_by_type": {ptype: count for ptype, count in type_counts},
        "properties_by_location": {loc: count for loc, count in location_counts},
        "avg_property_age_years": avg_age
    }


@router.get("/system/metrics", response_model=SystemMetrics)
async def get_system_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get system performance metrics."""
    
    # Database size (approximate)
    total_records = (
        db.query(func.count(User.id)).scalar() +
        db.query(func.count(Property.id)).scalar() +
        db.query(func.count(Inspection.id)).scalar() +
        db.query(func.count(Photo.id)).scalar()
    )
    
    # API usage (mock - would need actual tracking)
    api_calls_today = 1250
    
    # Storage usage (mock)
    storage_used_mb = db.query(func.count(Photo.id)).scalar() * 2.5  # Estimate 2.5MB per photo
    
    return {
        "total_database_records": total_records,
        "api_calls_today": api_calls_today,
        "storage_used_mb": round(storage_used_mb, 2),
        "uptime_percentage": 99.9,
        "avg_response_time_ms": 145
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a user and all their data (use with caution)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting yourself
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    # Delete user's properties (cascade will handle inspections, rooms, photos)
    db.query(Property).filter(Property.owner_id == user_id).delete()
    
    # Delete user
    db.delete(user)
    db.commit()
    
    return {"message": "User and all associated data deleted successfully"}
