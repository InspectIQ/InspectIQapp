from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import secrets
from backend.database.database import get_db
from backend.database.models import User, Property, Inspection, Room
from backend.schemas.inspection_extended import (
    InspectionCreate,
    InspectionResponse,
    RoomCreate,
    RoomResponse,
    InspectionAnalyzeRequest
)
from backend.auth.auth import get_current_active_user
from workflows import InspectionWorkflow
from schemas.inspection import InspectionInput
from schemas.common import Photo, PropertyContext, Property as PropertyInfo
from backend.services.photo_processing_service import PhotoProcessingService
from backend.services.property_data_service import PropertyDataService
from pydantic import BaseModel

router = APIRouter(prefix="/inspections", tags=["inspections"])


@router.post("", response_model=InspectionResponse, status_code=status.HTTP_201_CREATED)
async def create_inspection(
    inspection_data: InspectionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new inspection."""
    # Verify property ownership
    property = db.query(Property).filter(
        Property.id == inspection_data.property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Create inspection
    db_inspection = Inspection(
        property_id=inspection_data.property_id,
        inspector_id=current_user.id,
        inspection_type=inspection_data.inspection_type,
        notes=inspection_data.notes,
        status="draft",
        public_share_token=secrets.token_urlsafe(32)
    )
    db.add(db_inspection)
    db.commit()
    db.refresh(db_inspection)
    
    return db_inspection


@router.get("", response_model=List[InspectionResponse])
async def list_inspections(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    property_id: int = None,
    skip: int = 0,
    limit: int = 100
):
    """List all inspections for current user."""
    query = db.query(Inspection).filter(Inspection.inspector_id == current_user.id)
    
    if property_id:
        query = query.filter(Inspection.property_id == property_id)
    
    inspections = query.offset(skip).limit(limit).all()
    return inspections


@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_inspection(
    inspection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific inspection."""
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found"
        )
    
    return inspection


@router.post("/{inspection_id}/rooms", response_model=RoomResponse)
async def add_room(
    inspection_id: int,
    room_data: RoomCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a room to an inspection."""
    # Verify inspection ownership
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found"
        )
    
    # Create room
    db_room = Room(
        inspection_id=inspection_id,
        room_type=room_data.room_type,
        room_name=room_data.room_name,
        order_index=room_data.order_index,
        photo_urls=[]
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    
    return db_room


@router.post("/{inspection_id}/rooms/{room_id}/photos")
async def add_photo_to_room(
    inspection_id: int,
    room_id: int,
    photo_url: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a photo URL to a room."""
    # Verify ownership
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    room = db.query(Room).filter(
        Room.id == room_id,
        Room.inspection_id == inspection_id
    ).first()
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Add photo URL
    if room.photo_urls is None:
        room.photo_urls = []
    room.photo_urls.append(photo_url)
    db.commit()
    
    return {"message": "Photo added", "photo_url": photo_url}


@router.post("/{inspection_id}/analyze", response_model=InspectionResponse)
async def analyze_inspection(
    inspection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Run AI analysis on an inspection."""
    # Get inspection with rooms
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    # Get property
    property = db.query(Property).filter(Property.id == inspection.property_id).first()
    
    # Prepare photos from rooms
    photos = []
    for room in inspection.rooms:
        for photo_url in (room.photo_urls or []):
            photos.append(Photo(
                image_url=photo_url,
                room_name=room.room_name or room.room_type
            ))
    
    if not photos:
        raise HTTPException(status_code=400, detail="No photos to analyze")
    
    # Update status
    inspection.status = "processing"
    db.commit()
    
    try:
        # Run AI workflow
        workflow = InspectionWorkflow()
        input_data = InspectionInput(
            inspection_id=str(inspection.id),
            photos=photos,
            property_context=PropertyContext(
                property_type=property.property_type,
                state=property.state
            ),
            property=PropertyInfo(
                name=f"{property.address_line1}",
                address_line1=property.address_line1,
                city=property.city,
                state=property.state,
                postal_code=property.postal_code
            )
        )
        
        result = await workflow.run(input_data)
        
        # Update inspection with results
        inspection.report_markdown = result["report_markdown"]
        inspection.report_summary = result["report_summary_json"]
        inspection.issues_detected = result["issues_enriched"]
        inspection.summary_stats = result["summary"]
        inspection.status = "completed"
        
        db.commit()
        db.refresh(inspection)
        
        return inspection
        
    except Exception as e:
        inspection.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/{inspection_id}/pdf")
async def download_inspection_pdf(
    inspection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Download inspection report as PDF."""
    from fastapi.responses import StreamingResponse
    from backend.services.pdf_generator import PDFGenerator
    
    # Get inspection
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    if inspection.status != "completed":
        raise HTTPException(status_code=400, detail="Inspection not completed yet")
    
    # Get property
    property = db.query(Property).filter(Property.id == inspection.property_id).first()
    
    # Prepare data
    inspection_data = {
        "inspection_type": inspection.inspection_type.value,
        "inspection_date": inspection.inspection_date.isoformat(),
        "status": inspection.status,
        "summary_stats": inspection.summary_stats,
        "issues_enriched": inspection.issues_detected,
        "property": {
            "address_line1": property.address_line1,
            "city": property.city,
            "state": property.state,
            "postal_code": property.postal_code,
            "property_type": property.property_type
        } if property else None
    }
    
    # Generate PDF
    pdf_buffer = PDFGenerator.generate_inspection_report(inspection_data)
    
    # Return as download
    filename = f"inspection_{inspection_id}_{inspection.inspection_date.strftime('%Y%m%d')}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.delete("/{inspection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inspection(
    inspection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an inspection."""
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    db.delete(inspection)
    db.commit()
    return None


class QuickInspectionCreate(BaseModel):
    property_id: int
    inspection_type: str = "Move-in Inspection"
    auto_create_rooms: bool = True


class BulkPhotoUpload(BaseModel):
    inspection_id: int
    photos: List[str]  # Base64 encoded photos
    auto_assign_rooms: bool = True


@router.post("/quick-create", response_model=InspectionResponse)
async def quick_create_inspection(
    request: QuickInspectionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Quickly create an inspection with auto-generated rooms."""
    # Verify property ownership
    property = db.query(Property).filter(
        Property.id == request.property_id,
        Property.owner_id == current_user.id
    ).first()
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Create inspection
    db_inspection = Inspection(
        property_id=request.property_id,
        inspector_id=current_user.id,
        inspection_type=request.inspection_type,
        status="draft",
        public_share_token=secrets.token_urlsafe(32)
    )
    db.add(db_inspection)
    db.commit()
    db.refresh(db_inspection)
    
    # Auto-create rooms if requested
    if request.auto_create_rooms:
        suggested_rooms = await PropertyDataService.suggest_room_layout(
            property.property_type or "Single Family Home",
            property.bedrooms or 3,
            property.bathrooms or 2
        )
        
        for i, room_data in enumerate(suggested_rooms):
            db_room = Room(
                inspection_id=db_inspection.id,
                room_type=room_data["type"],
                room_name=room_data["name"],
                order_index=i,
                photo_urls=[]
            )
            db.add(db_room)
        
        db.commit()
        db.refresh(db_inspection)
    
    return db_inspection


@router.post("/bulk-photo-upload")
async def bulk_photo_upload(
    files: List[UploadFile] = File(...),
    inspection_id: int = None,
    auto_assign_rooms: bool = True,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload multiple photos and auto-assign to rooms."""
    # Verify inspection ownership
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found"
        )
    
    # Get room names for auto-assignment
    rooms = db.query(Room).filter(Room.inspection_id == inspection_id).all()
    room_names = [room.room_name or room.room_type for room in rooms]
    
    # Process photos
    photo_bytes_list = []
    for file in files:
        content = await file.read()
        photo_bytes_list.append(content)
    
    # Process bulk photos
    processed_photos = await PhotoProcessingService.process_bulk_photos(
        photo_bytes_list, room_names
    )
    
    # Auto-assign photos to rooms if requested
    if auto_assign_rooms and rooms:
        for photo in processed_photos:
            suggested_room = photo.get("suggested_room")
            if suggested_room:
                # Find matching room
                room = next((r for r in rooms if r.room_name == suggested_room or r.room_type == suggested_room), None)
                if room:
                    # In a real implementation, you'd save the photo to storage first
                    # For now, we'll use a placeholder URL
                    photo_url = f"/uploads/inspection_{inspection_id}/photo_{photo['hash']}.jpg"
                    
                    if room.photo_urls is None:
                        room.photo_urls = []
                    room.photo_urls.append(photo_url)
    
    db.commit()
    
    # Generate summary
    summary = await PhotoProcessingService.generate_photo_summary(processed_photos)
    
    return {
        "message": f"Successfully uploaded {len(processed_photos)} photos",
        "processed_photos": len(processed_photos),
        "summary": summary,
        "photos": processed_photos
    }


@router.post("/templates")
async def get_inspection_templates(
    current_user: User = Depends(get_current_active_user)
):
    """Get inspection templates for quick creation."""
    templates = [
        {
            "name": "Move-in Inspection",
            "type": "move_in",
            "description": "Document property condition before tenant moves in",
            "typical_duration": "30-45 minutes",
            "focus_areas": ["Overall condition", "Existing damage", "Cleanliness", "Functionality"]
        },
        {
            "name": "Move-out Inspection", 
            "type": "move_out",
            "description": "Document property condition after tenant moves out",
            "typical_duration": "45-60 minutes",
            "focus_areas": ["Damage assessment", "Cleaning requirements", "Repairs needed", "Security deposit"]
        },
        {
            "name": "Routine Maintenance",
            "type": "maintenance",
            "description": "Regular property maintenance check",
            "typical_duration": "20-30 minutes",
            "focus_areas": ["HVAC", "Plumbing", "Electrical", "Safety systems"]
        },
        {
            "name": "Pre-Purchase Inspection",
            "type": "purchase",
            "description": "Comprehensive inspection before buying",
            "typical_duration": "60-90 minutes",
            "focus_areas": ["Structural", "Systems", "Safety", "Code compliance"]
        }
    ]
    
    return {"templates": templates}


@router.post("/{inspection_id}/auto-analyze")
async def auto_analyze_inspection(
    inspection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Automatically analyze inspection and generate preliminary report."""
    # Get inspection
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    # Get photos from all rooms
    rooms = db.query(Room).filter(Room.inspection_id == inspection_id).all()
    total_photos = sum(len(room.photo_urls or []) for room in rooms)
    
    if total_photos == 0:
        raise HTTPException(status_code=400, detail="No photos to analyze")
    
    # Mock AI analysis results
    # In production, this would call actual AI services
    analysis_results = {
        "total_photos_analyzed": total_photos,
        "issues_detected": [
            {
                "room": "Kitchen",
                "issue": "Minor cabinet wear",
                "severity": "low",
                "confidence": 0.8,
                "recommendation": "Consider touch-up painting"
            },
            {
                "room": "Bathroom",
                "issue": "Possible water stain",
                "severity": "medium", 
                "confidence": 0.7,
                "recommendation": "Investigate for leaks"
            }
        ],
        "overall_condition": "Good",
        "estimated_repair_cost": 250,
        "priority_items": 1
    }
    
    # Update inspection status
    inspection.status = "analyzed"
    inspection.summary_stats = analysis_results
    db.commit()
    
    return {
        "message": "Analysis completed",
        "analysis": analysis_results,
        "inspection_id": inspection_id
    }
