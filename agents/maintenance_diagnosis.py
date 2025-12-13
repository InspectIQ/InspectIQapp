from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import ProcessedPhoto, PropertyContext
from schemas.diagnosis import DiagnosisIssue
from config.settings import get_settings
from .building_codes_reference import BuildingCodesReference
import json


class MaintenanceDiagnosisAgent:
    """Diagnoses maintenance issues from photos and user description."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _build_system_prompt(self, property_state: Optional[str] = None) -> str:
        base_prompt = """You are the Maintenance Diagnosis Agent for InspectIQ. Users upload photos and an optional description of a home problem. Your job is to:

Identify the most likely underlying issue(s) visible in the images, combined with the description, AND assess potential building code violations.

For each issue, determine:
- issue_label (short phrase, e.g. "ceiling leak", "possible mold", "damaged drywall")
- system (one of: "plumbing","roof","hvac","electrical","structure","appliance","other")
- urgency ("low","medium","high","critical")
- probable_cause (short explanation in plain English)
- confidence (0–1)
- potential_code_violation (true/false)
- code_category ("electrical", "plumbing", "safety", "structural", "fire_safety", "ventilation", "none")
- compliance_recommendation (brief guidance if code violation suspected, null otherwise)

BUILDING CODE CONSIDERATIONS:
- ELECTRICAL: Exposed wiring, improper grounding, overloaded circuits, missing GFCI protection
- PLUMBING: Leaks, improper drainage, cross-connections, non-compliant fixtures
- SAFETY: Missing safety devices, blocked exits, unsafe conditions
- STRUCTURAL: Load-bearing damage, foundation issues, structural integrity concerns
- FIRE SAFETY: Fire hazards, blocked exits, improper installations
- VENTILATION: Inadequate ventilation, blocked vents, moisture issues

Produce a diagnosis_summary in a single short paragraph that includes both the maintenance issue and any code compliance concerns.

Be honest about uncertainty; if multiple causes are plausible, mention the most likely and briefly note alternatives.

IMPORTANT DISCLAIMER: Building code guidance is general only. Local codes vary by jurisdiction. Consult local authorities and licensed professionals for official compliance determinations.

Output only valid JSON with this structure:
{
  "diagnosis_summary": "string (1-3 sentences including code considerations)",
  "issues": [
    {
      "issue_label": "string",
      "system": "string",
      "urgency": "string",
      "probable_cause": "string",
      "confidence": number,
      "potential_code_violation": boolean,
      "code_category": "string",
      "compliance_recommendation": "string or null"
    }
  ]
}"""

        # Add state-specific considerations if available
        if property_state:
            state_specific = self._get_state_specific_guidance(property_state)
            if state_specific:
                base_prompt += f"\n\nSTATE-SPECIFIC CONSIDERATIONS ({property_state}):\n{state_specific}"
        
        return base_prompt

    def _get_state_specific_guidance(self, state: str) -> str:
        """Get state-specific building code guidance for maintenance issues."""
        return BuildingCodesReference.get_state_guidance(state)

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
        property_state = property_context.state if property_context else None
        messages = [
            {"role": "system", "content": self._build_system_prompt(property_state)}
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
