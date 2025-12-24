from pydantic import BaseModel, field_validator
from typing import Optional, List, Union
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
    inspection_type: Union[InspectionType, str]
    notes: Optional[str] = None
    
    @field_validator('inspection_type')
    @classmethod
    def validate_inspection_type(cls, v):
        if isinstance(v, str):
            try:
                return InspectionType(v)
            except ValueError:
                # If the string doesn't match an enum value, try to find a close match
                valid_values = [e.value for e in InspectionType]
                raise ValueError(f"Invalid inspection_type. Must be one of: {valid_values}")
        return v


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
