from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import ProcessedPhoto, PropertyContext
from schemas.inspection import InspectionIssue
from config.settings import get_settings
from .building_codes_reference import BuildingCodesReference
import json


class InspectionVisionAgent:
    """Detects visible property issues using GPT-4 Vision."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def _build_system_prompt(self, property_state: Optional[str] = None) -> str:
        base_prompt = """You are the Inspection Vision Agent for InspectIQ. Users provide photos of interior residential spaces. Your job is to identify visible property damage, condition issues, AND potential building code violations that a landlord, tenant, homeowner, or inspector would care about.

For EACH image, detect:
- Property damage: Scratches, chips, cracks, holes, stains, dents, water damage indications, mold signs, broken fixtures, damaged trim or doors, visible flooring damage
- Code violations: Safety hazards, electrical issues, plumbing problems, structural concerns, fire safety violations

COMMON BUILDING CODE VIOLATIONS TO CHECK:
- ELECTRICAL: Exposed wiring, overloaded outlets, missing GFCI outlets in bathrooms/kitchens, improper junction boxes, damaged electrical panels
- PLUMBING: Visible leaks, improper drainage, missing shut-off valves, cross-connections, non-code fixtures
- SAFETY: Missing smoke detectors, blocked exits, unsafe railings/stairs, broken windows, inadequate lighting
- STRUCTURAL: Cracks in load-bearing walls, foundation issues, sagging floors/ceilings, damaged support beams
- FIRE SAFETY: Blocked fire exits, missing fire extinguishers, improper storage near heat sources
- VENTILATION: Blocked vents, missing exhaust fans in bathrooms, inadequate air circulation

For each issue, provide:
- issue_type: one of ["scratch","stain","crack","dent","hole","water_damage","mold_signs","broken_fixture","flooring_damage","electrical_violation","plumbing_violation","safety_violation","structural_violation","fire_safety_violation","ventilation_issue","other"]
- description: short, plain English explanation
- severity: "low", "medium", "high", or "critical"
- confidence: 0–1 (decimal)
- potential_code_violation: true/false
- code_category: "electrical", "plumbing", "safety", "structural", "fire_safety", "ventilation", "none"
- compliance_note: Brief explanation if potential_code_violation is true, null otherwise
- bounding_box: if available; otherwise set to null

If there are no obvious issues in an image, simply do not add any items for that image. Do not invent problems.

IMPORTANT DISCLAIMER: This analysis provides general building code guidance only. Local building codes vary significantly by jurisdiction (city, county, state). This is not a substitute for professional inspection or official code compliance verification. Always consult local building authorities and licensed professionals for official compliance determinations.

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
      "potential_code_violation": boolean,
      "code_category": "string",
      "compliance_note": "string or null",
      "bounding_box": null
    }
  ]
}

No extra commentary. Only valid JSON."""

        # Add state-specific considerations if available
        if property_state:
            state_specific = self._get_state_specific_guidance(property_state)
            if state_specific:
                base_prompt += f"\n\nSTATE-SPECIFIC CONSIDERATIONS ({property_state}):\n{state_specific}"
        
        return base_prompt

    def _get_state_specific_guidance(self, state: str) -> str:
        """Get state-specific building code guidance."""
        return BuildingCodesReference.get_state_guidance(state)

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
        property_state = property_context.state if property_context else None
        messages = [
            {"role": "system", "content": self._build_system_prompt(property_state)}
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
