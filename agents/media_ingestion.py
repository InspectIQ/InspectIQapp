from typing import List, Optional
from schemas.common import Photo, ProcessedPhoto
import re


class MediaIngestionAgent:
    """Validates and normalizes incoming photo URLs."""
    
    @staticmethod
    def is_valid_url(url: str) -> bool:
        """Check if URL looks valid."""
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
            r'localhost|'  # localhost
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or IP
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return url_pattern.match(url) is not None
    
    async def process(
        self,
        photos: List[Photo],
        inspection_id: Optional[str] = None,
        diagnosis_id: Optional[str] = None
    ) -> dict:
        """
        Validate and normalize photo URLs.
        
        Returns:
            dict with processed_photos, inspection_id, diagnosis_id
        """
        processed_photos = []
        
        for photo in photos:
            url_str = str(photo.image_url)
            
            # Validate URL
            if not url_str or not self.is_valid_url(url_str):
                continue
            
            processed_photos.append(
                ProcessedPhoto(
                    image_url=url_str,
                    room_name=photo.room_name,
                    order_index=photo.order_index
                )
            )
        
        return {
            "inspection_id": inspection_id,
            "diagnosis_id": diagnosis_id,
            "processed_photos": processed_photos
        }
