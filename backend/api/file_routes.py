from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List
import os
import uuid
from pathlib import Path
from config.settings import get_settings
from backend.auth.auth import get_current_active_user
from backend.database.models import User

router = APIRouter(prefix="/files", tags=["files"])
settings = get_settings()

# Create upload directory if it doesn't exist
UPLOAD_DIR = Path(settings.upload_dir)
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a single file."""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        contents = await file.read()
        
        # Check file size
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
            )
        
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Return file URL
        file_url = f"/api/v1/files/{unique_filename}"
        return {
            "filename": unique_filename,
            "original_filename": file.filename,
            "url": file_url,
            "size": len(contents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


@router.post("/upload-multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload multiple files."""
    uploaded_files = []
    
    for file in files:
        try:
            # Check file extension
            file_ext = os.path.splitext(file.filename)[1].lower()
            if file_ext not in ALLOWED_EXTENSIONS:
                continue
            
            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file
            contents = await file.read()
            
            # Check file size
            if len(contents) > MAX_FILE_SIZE:
                continue
            
            with open(file_path, "wb") as f:
                f.write(contents)
            
            # Add to results
            file_url = f"/api/v1/files/{unique_filename}"
            uploaded_files.append({
                "filename": unique_filename,
                "original_filename": file.filename,
                "url": file_url,
                "size": len(contents)
            })
        except Exception as e:
            print(f"Failed to upload {file.filename}: {e}")
            continue
    
    return {"files": uploaded_files, "count": len(uploaded_files)}


@router.get("/{filename}")
async def get_file(filename: str):
    """Serve an uploaded file."""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)


@router.delete("/{filename}")
async def delete_file(
    filename: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete an uploaded file."""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        os.remove(file_path)
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
