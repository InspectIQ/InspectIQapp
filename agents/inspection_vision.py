from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import ProcessedPhoto, PropertyContext
from schemas.inspection import InspectionIssue
from config.settings import get_settings
import json


class InspectionVisionAgent:
    """Detects visible property issues using GPT-4 Vision."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _build_system_prompt(self) -> str:
        return """You are the Inspection Vision Agent for InspectIQ. Users provide photos of interior residential spaces. Your job is to identify visible property damage or condition issues that a landlord, tenant, homeowner, or inspector would care about.

For EACH image, detect:
- Scratches, chips, cracks, holes, stains, dents, water damage indications, mold signs, broken fixtures, damaged trim or doors, visible flooring damage.

For each issue, choose:
- issue_type: one of ["scratch","stain","crack","dent","hole","water_damage","mold_signs","broken_fixture","flooring_damage","other"]
- description: short, plain English explanation
- severity: "low", "medium", "high", or "critical"
- confidence: 0–1 (decimal)
- bounding_box: if available; otherwise set to null

If there are no obvious issues in an image, simply do not add any items for that image. Do not invent problems.

Output a single JSON object with this structure:
{
  "issues": [
    {
      "image_url": "string",
      "room_name": "string or null",
      "issue_type": "string",
      "description": "string",
      "severity": "string",
      "confidence": number,
      "bounding_box": null
    }
  ]
}

No extra commentary. Only valid JSON."""

    async def process(
        self,
        inspection_id: Optional[str],
        processed_photos: List[ProcessedPhoto],
        property_context: Optional[PropertyContext] = None
    ) -> dict:
        """
        Analyze photos for property damage and issues.
        
        Returns:
            dict with inspection_id and issues list
        """
        if not processed_photos:
            return {
                "inspection_id": inspection_id,
                "issues": []
            }
        
        # Build messages for vision API
        messages = [
            {"role": "system", "content": self._build_system_prompt()}
        ]
        
        # Add context if available
        context_info = ""
        if property_context:
            if property_context.property_type:
                context_info += f"Property type: {property_context.property_type}. "
            if property_context.state:
                context_info += f"State: {property_context.state}. "
        
        # Build user message with all images
        user_content = []
        if context_info:
            user_content.append({"type": "text", "text": context_info})
        
        user_content.append({
            "type": "text",
            "text": f"Analyze these {len(processed_photos)} property photos for damage and issues:"
        })
        
        for photo in processed_photos:
            user_content.append({
                "type": "image_url",
                "image_url": {"url": photo.image_url}
            })
        
        messages.append({"role": "user", "content": user_content})
        
        # Call OpenAI
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=4096,
            temperature=0.3
        )
        
        # Parse response
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            issues = result.get("issues", [])
            
            # Enrich with room names from processed_photos
            for issue in issues:
                matching_photo = next(
                    (p for p in processed_photos if p.image_url == issue.get("image_url")),
                    None
                )
                if matching_photo and matching_photo.room_name and not issue.get("room_name"):
                    issue["room_name"] = matching_photo.room_name
            
            return {
                "inspection_id": inspection_id,
                "issues": issues
            }
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "inspection_id": inspection_id,
                "issues": []
            }
