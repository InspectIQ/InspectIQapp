from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.database.models import InspectionType


class RoomCreate(BaseModel):
    room_type: str
    room_name: Optional[str] = None
    order_index: Optional[int] = None


class RoomResponse(BaseModel):
    id: int
    room_type: str
    room_name: Optional[str] = None
    order_index: Optional[int] = None
    photo_urls: List[str] = []
    issues: List[dict] = []
    
    class Config:
        from_attributes = True


class InspectionCreate(BaseModel):
    property_id: int
    inspection_type: InspectionType
    notes: Optional[str] = None


class InspectionResponse(BaseModel):
    id: int
    property_id: int
    inspector_id: int
    inspection_type: InspectionType
    inspection_date: datetime
    status: str
    report_markdown: Optional[str] = None
    report_pdf_url: Optional[str] = None
    report_summary: Optional[dict] = None
    issues_detected: Optional[List[dict]] = None
    summary_stats: Optional[dict] = None
    is_public: bool
    public_share_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    rooms: List[RoomResponse] = []
    
    class Config:
        from_attributes = True


class InspectionAnalyzeRequest(BaseModel):
    """Request to analyze an inspection with AI."""
    pass


class InspectionCompareRequest(BaseModel):
    """Request to compare two inspections."""
    baseline_inspection_id: int
    current_inspection_id: int
