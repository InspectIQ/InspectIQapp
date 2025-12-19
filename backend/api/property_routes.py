from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database.database import get_db
from backend.database.models import User, Property
from backend.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse
from backend.auth.auth import get_current_active_user
from backend.services.property_data_service import PropertyDataService
from pydantic import BaseModel

router = APIRouter(prefix="/properties", tags=["properties"])


class AddressLookupRequest(BaseModel):
    address: str


class QuickPropertyCreate(BaseModel):
    address: str
    property_type: Optional[str] = None
    create_inspection: bool = False
    inspection_type: Optional[str] = "Move-in Inspection"


@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
async def create_property(
    property_data: PropertyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new property."""
    db_property = Property(
        **property_data.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property


@router.get("", response_model=List[PropertyResponse])
async def list_properties(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """List all properties for current user."""
    properties = db.query(Property).filter(
        Property.owner_id == current_user.id,
        Property.is_active == True
    ).offset(skip).limit(limit).all()
    return properties


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific property."""
    property = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return property


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a property."""
    property = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Update fields
    update_data = property_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property, field, value)
    
    db.commit()
    db.refresh(property)
    return property


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete (soft delete) a property."""
    property = db.query(Property).filter(
        Property.id == property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    property.is_active = False
    db.commit()
    return None


@router.post("/lookup-address")
async def lookup_property_data(
    request: AddressLookupRequest,
    current_user: User = Depends(get_current_active_user)
):
    """Look up property data from address to pre-fill form."""
    property_data = await PropertyDataService.get_property_data_from_address(request.address)
    
    if property_data:
        # Suggest room layout based on property data
        suggested_rooms = await PropertyDataService.suggest_room_layout(
            property_data.get("property_type", ""),
            property_data.get("bedrooms", 3),
            property_data.get("bathrooms", 2)
        )
        property_data["suggested_rooms"] = suggested_rooms
    
    return {
        "address": request.address,
        "property_data": property_data,
        "success": property_data is not None
    }


@router.post("/quick-create", response_model=PropertyResponse)
async def quick_create_property(
    request: QuickPropertyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Quickly create a property with auto-filled data and optional inspection."""
    # Get property data from address
    property_data = await PropertyDataService.get_property_data_from_address(request.address)
    
    # Create property with available data
    property_create_data = {
        "address": request.address,
        "property_type": request.property_type or (property_data.get("property_type") if property_data else "Single Family Home"),
        "bedrooms": property_data.get("bedrooms", 3) if property_data else 3,
        "bathrooms": property_data.get("bathrooms", 2) if property_data else 2,
        "square_feet": property_data.get("square_feet") if property_data else None,
        "year_built": property_data.get("year_built") if property_data else None,
        "lot_size": property_data.get("lot_size") if property_data else None
    }
    
    # Remove None values
    property_create_data = {k: v for k, v in property_create_data.items() if v is not None}
    
    # Create property
    db_property = Property(
        **property_create_data,
        owner_id=current_user.id
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    
    # Optionally create inspection with suggested rooms
    if request.create_inspection:
        from backend.database.models import Inspection, Room
        
        # Create inspection
        inspection = Inspection(
            property_id=db_property.id,
            inspection_type=request.inspection_type,
            status="in_progress"
        )
        db.add(inspection)
        db.commit()
        db.refresh(inspection)
        
        # Add suggested rooms if we have property data
        if property_data:
            suggested_rooms = await PropertyDataService.suggest_room_layout(
                property_create_data.get("property_type", ""),
                property_create_data.get("bedrooms", 3),
                property_create_data.get("bathrooms", 2)
            )
            
            for room_data in suggested_rooms:
                room = Room(
                    inspection_id=inspection.id,
                    name=room_data["name"],
                    room_type=room_data["type"]
                )
                db.add(room)
            
            db.commit()
    
    return db_property


@router.get("/templates")
async def get_property_templates(
    current_user: User = Depends(get_current_active_user)
):
    """Get property templates for quick creation."""
    templates = [
        {
            "name": "Single Family Home",
            "property_type": "Single Family Home",
            "typical_rooms": [
                {"name": "Living Room", "type": "living_space"},
                {"name": "Kitchen", "type": "kitchen"},
                {"name": "Master Bedroom", "type": "bedroom"},
                {"name": "Bedroom 2", "type": "bedroom"},
                {"name": "Master Bathroom", "type": "bathroom"},
                {"name": "Bathroom 2", "type": "bathroom"},
                {"name": "Garage", "type": "utility"},
                {"name": "Laundry Room", "type": "utility"}
            ]
        },
        {
            "name": "Apartment/Condo",
            "property_type": "Apartment",
            "typical_rooms": [
                {"name": "Living Room", "type": "living_space"},
                {"name": "Kitchen", "type": "kitchen"},
                {"name": "Bedroom", "type": "bedroom"},
                {"name": "Bathroom", "type": "bathroom"},
                {"name": "Balcony/Patio", "type": "outdoor"}
            ]
        },
        {
            "name": "Townhouse",
            "property_type": "Townhouse",
            "typical_rooms": [
                {"name": "Living Room", "type": "living_space"},
                {"name": "Kitchen", "type": "kitchen"},
                {"name": "Dining Room", "type": "living_space"},
                {"name": "Master Bedroom", "type": "bedroom"},
                {"name": "Bedroom 2", "type": "bedroom"},
                {"name": "Master Bathroom", "type": "bathroom"},
                {"name": "Bathroom 2", "type": "bathroom"},
                {"name": "Garage", "type": "utility"}
            ]
        }
    ]
    
    return {"templates": templates}
