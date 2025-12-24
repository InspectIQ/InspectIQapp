from pydantic import BaseModel, field_validator
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
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    lot_size: Optional[float] = None
    # Legacy field for backward compatibility
    num_rooms: Optional[int] = None
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
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    lot_size: Optional[float] = None
    # Legacy field for backward compatibility
    num_rooms: Optional[int] = None
    notes: Optional[str] = None


class PropertyResponse(PropertyBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def model_validate(cls, obj, **kwargs):
        """Custom validation to handle missing database columns gracefully."""
        try:
            return super().model_validate(obj, **kwargs)
        except Exception as e:
            # If validation fails, try to create a dict with available attributes
            if hasattr(obj, '__dict__'):
                data = {}
                for field_name, field_info in cls.model_fields.items():
                    if hasattr(obj, field_name):
                        data[field_name] = getattr(obj, field_name)
                    else:
                        # Use default value for missing fields
                        if field_info.default is not None:
                            data[field_name] = field_info.default
                        else:
                            data[field_name] = None
                return cls(**data)
            else:
                raise e
    
    class Config:
        from_attributes = True
