from pydantic import BaseModel, HttpUrl, Field
from typing import Optional


class Photo(BaseModel):
    image_url: HttpUrl
    room_name: Optional[str] = None
    order_index: Optional[int] = None


class ProcessedPhoto(BaseModel):
    image_url: str
    room_name: Optional[str] = None
    order_index: Optional[int] = None


class PropertyContext(BaseModel):
    property_type: Optional[str] = None
    state: Optional[str] = None


class Property(BaseModel):
    name: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
