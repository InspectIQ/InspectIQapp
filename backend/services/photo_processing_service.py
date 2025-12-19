import asyncio
from typing import List, Dict, Any, Optional
from PIL import Image, ExifTags
import io
import base64
from datetime import datetime
import hashlib

class PhotoProcessingService:
    """Service for processing and organizing uploaded photos."""
    
    @staticmethod
    async def process_bulk_photos(photos: List[bytes], room_names: List[str]) -> List[Dict[str, Any]]:
        """
        Process multiple photos and attempt to auto-assign to rooms.
        Returns list of processed photo data with suggested room assignments.
        """
        processed_photos = []
        
        for i, photo_bytes in enumerate(photos):
            try:
                # Process individual photo
                photo_data = await PhotoProcessingService._process_single_photo(photo_bytes, i)
                
                # Attempt to auto-assign room
                suggested_room = await PhotoProcessingService._suggest_room_assignment(
                    photo_data, room_names
                )
                
                photo_data["suggested_room"] = suggested_room
                photo_data["confidence"] = 0.8 if suggested_room else 0.0
                
                processed_photos.append(photo_data)
                
            except Exception as e:
                print(f"Error processing photo {i}: {e}")
                continue
        
        return processed_photos
    
    @staticmethod
    async def _process_single_photo(photo_bytes: bytes, index: int) -> Dict[str, Any]:
        """Process a single photo and extract metadata."""
        try:
            # Open image
            image = Image.open(io.BytesIO(photo_bytes))
            
            # Extract EXIF data
            exif_data = {}
            if hasattr(image, '_getexif') and image._getexif():
                exif = image._getexif()
                for tag_id, value in exif.items():
                    tag = ExifTags.TAGS.get(tag_id, tag_id)
                    exif_data[tag] = value
            
            # Generate photo hash for deduplication
            photo_hash = hashlib.md5(photo_bytes).hexdigest()
            
            # Basic image analysis
            width, height = image.size
            file_size = len(photo_bytes)
            
            # Convert to base64 for storage/transmission
            photo_base64 = base64.b64encode(photo_bytes).decode('utf-8')
            
            return {
                "index": index,
                "hash": photo_hash,
                "width": width,
                "height": height,
                "file_size": file_size,
                "format": image.format,
                "timestamp": exif_data.get("DateTime", datetime.now().isoformat()),
                "data": photo_base64,
                "exif": exif_data
            }
            
        except Exception as e:
            raise Exception(f"Failed to process photo: {e}")
    
    @staticmethod
    async def _suggest_room_assignment(photo_data: Dict[str, Any], room_names: List[str]) -> Optional[str]:
        """
        Use simple heuristics to suggest room assignment.
        In a real implementation, this would use AI/ML for image recognition.
        """
        # For now, use simple filename-based heuristics
        # In production, this would analyze the actual image content
        
        # Mock room detection based on image characteristics
        # This is where you'd integrate with computer vision APIs
        
        room_keywords = {
            "kitchen": ["kitchen", "stove", "refrigerator", "sink"],
            "bathroom": ["bathroom", "toilet", "shower", "bath"],
            "bedroom": ["bedroom", "bed", "closet"],
            "living room": ["living", "sofa", "couch", "tv"],
            "garage": ["garage", "car", "tools"],
            "laundry": ["laundry", "washer", "dryer"]
        }
        
        # Simple assignment based on available rooms
        # In production, this would use actual image analysis
        if room_names:
            return room_names[photo_data["index"] % len(room_names)]
        
        return None
    
    @staticmethod
    async def detect_issues_in_photos(photos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Analyze photos for potential issues.
        This is a simplified version - production would use AI vision models.
        """
        issues_detected = []
        
        for photo in photos:
            # Mock issue detection
            # In production, this would use computer vision to detect:
            # - Cracks in walls
            # - Water damage
            # - Electrical issues
            # - Plumbing problems
            # - etc.
            
            mock_issues = [
                {
                    "type": "surface_damage",
                    "description": "Possible wall scuff or mark detected",
                    "severity": "low",
                    "confidence": 0.7,
                    "location": {"x": 150, "y": 200, "width": 50, "height": 30}
                },
                {
                    "type": "maintenance_needed",
                    "description": "Fixture may need attention",
                    "severity": "medium",
                    "confidence": 0.6,
                    "location": {"x": 300, "y": 100, "width": 80, "height": 60}
                }
            ]
            
            # Randomly assign some issues for demo purposes
            import random
            if random.random() > 0.7:  # 30% chance of detecting issues
                issues_detected.append({
                    "photo_hash": photo["hash"],
                    "issues": [random.choice(mock_issues)]
                })
        
        return issues_detected
    
    @staticmethod
    async def generate_photo_summary(photos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary of uploaded photos."""
        total_photos = len(photos)
        total_size = sum(photo["file_size"] for photo in photos)
        
        # Count photos by suggested room
        room_counts = {}
        for photo in photos:
            room = photo.get("suggested_room", "Unassigned")
            room_counts[room] = room_counts.get(room, 0) + 1
        
        return {
            "total_photos": total_photos,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "photos_by_room": room_counts,
            "processing_timestamp": datetime.now().isoformat()
        }