from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
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
