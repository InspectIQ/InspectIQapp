from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import ProcessedPhoto, PropertyContext
from schemas.diagnosis import DiagnosisIssue
from config.settings import get_settings
import json


class MaintenanceDiagnosisAgent:
    """Diagnoses maintenance issues from photos and user description."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _build_system_prompt(self) -> str:
        return """You are the Maintenance Diagnosis Agent for InspectIQ. Users upload photos and an optional description of a home problem. Your job is to:

Identify the most likely underlying issue(s) visible in the images, combined with the description.

For each issue, determine:
- issue_label (short phrase, e.g. "ceiling leak", "possible mold", "damaged drywall")
- system (one of: "plumbing","roof","hvac","electrical","structure","appliance","other")
- urgency ("low","medium","high","critical")
- probable_cause (short explanation in plain English)
- confidence (0–1)

Produce a diagnosis_summary in a single short paragraph.

Be honest about uncertainty; if multiple causes are plausible, mention the most likely and briefly note alternatives.

Output only valid JSON with this structure:
{
  "diagnosis_summary": "string (1-3 sentences)",
  "issues": [
    {
      "issue_label": "string",
      "system": "string",
      "urgency": "string",
      "probable_cause": "string",
      "confidence": number
    }
  ]
}"""

    async def process(
        self,
        diagnosis_id: Optional[str],
        processed_photos: List[ProcessedPhoto],
        user_description: Optional[str] = None,
        property_context: Optional[PropertyContext] = None
    ) -> dict:
        """
        Diagnose maintenance issue from photos and description.
        
        Returns:
            dict with diagnosis_id, diagnosis_summary, and issues
        """
        if not processed_photos:
            return {
                "diagnosis_id": diagnosis_id,
                "diagnosis_summary": "No photos provided for analysis.",
                "issues": []
            }
        
        # Build messages
        messages = [
            {"role": "system", "content": self._build_system_prompt()}
        ]
        
        # Build user message
        user_content = []
        
        context_info = ""
        if property_context:
            if property_context.property_type:
                context_info += f"Property type: {property_context.property_type}. "
            if property_context.state:
                context_info += f"State: {property_context.state}. "
        
        if context_info:
            user_content.append({"type": "text", "text": context_info})
        
        if user_description:
            user_content.append({
                "type": "text",
                "text": f"User description: {user_description}"
            })
        
        user_content.append({
            "type": "text",
            "text": f"Diagnose the maintenance issue from these {len(processed_photos)} photos:"
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
            max_tokens=2048,
            temperature=0.3
        )
        
        # Parse response
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            return {
                "diagnosis_id": diagnosis_id,
                "diagnosis_summary": result.get("diagnosis_summary", ""),
                "issues": result.get("issues", [])
            }
        except json.JSONDecodeError:
            return {
                "diagnosis_id": diagnosis_id,
                "diagnosis_summary": "Unable to parse diagnosis.",
                "issues": []
            }
