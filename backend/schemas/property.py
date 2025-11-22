from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PropertyBase(BaseModel):
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "USA"
    unit_number: Optional[str] = None
    property_type: Optional[str] = None
    num_rooms: Optional[int] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    notes: Optional[str] = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    unit_number: Optional[str] = None
    property_type: Optional[str] = None
    num_rooms: Optional[int] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    notes: Optional[str] = None


class PropertyResponse(PropertyBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
