from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Optional


class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_properties: int
    total_inspections: int
    completed_inspections: int
    pending_inspections: int
    total_photos: int
    new_users_this_week: int
    new_inspections_this_week: int
    avg_inspections_per_user: float


class UserListResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
    property_count: int
    inspection_count: int


class UserDetailResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
    properties: List[dict]
    recent_inspections: List[dict]
    total_photos: int
    
    class Config:
        from_attributes = True


class InspectionByDay(BaseModel):
    date: str
    count: int


class InspectionAnalytics(BaseModel):
    total_inspections: int
    inspections_by_day: List[InspectionByDay]
    status_breakdown: Dict[str, int]
    avg_completion_time_minutes: int


class PropertyAnalytics(BaseModel):
    total_properties: int
    properties_by_type: Dict[str, int]
    properties_by_location: Dict[str, int]
    avg_property_age_years: int


class SystemMetrics(BaseModel):
    total_database_records: int
    api_calls_today: int
    storage_used_mb: float
    uptime_percentage: float
    avg_response_time_ms: int


class ActivityLog(BaseModel):
    id: int
    user_id: int
    action: str
    resource_type: str
    resource_id: Optional[int]
    timestamp: datetime
    ip_address: Optional[str]
