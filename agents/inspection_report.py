from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import Property
from schemas.inspection import InspectionReport
from config.settings import get_settings
import json


class InspectionReportAgent:
    """Converts enriched inspection data into markdown report + JSON summary."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4-turbo-preview"
    
    def _build_system_prompt(self) -> str:
        return """You are the Inspection Report Agent for InspectIQ. Turn the provided property info, enriched issues, and summary into:

1. A clear markdown report body suitable for PDF export
2. A short machine-readable summary JSON

Markdown structure MUST include:
## InspectIQ Inspection Report
### Property Details
### Executive Summary (issues count, overall severity, cost range, code compliance overview)
### Code Compliance Assessment (separate section for potential violations)
### Room-by-Room Details (group issues by room_name where possible)
### Priority Action Items (urgent safety/code issues first)
### Recommended Next Steps (clear bullet list including professional consultations)
### Important Disclaimers

BUILDING CODE COMPLIANCE SECTION:
- Highlight any potential code violations found
- Categorize by system (electrical, plumbing, safety, structural, etc.)
- Include severity and recommended professional consultation
- Always include disclaimer about local code variations

PRIORITY SYSTEM:
1. Critical safety/code violations (immediate attention)
2. High-priority maintenance issues
3. Medium-priority repairs
4. Low-priority cosmetic issues

Use a friendly, consumer-focused tone, simple language, and avoid providing legal advice. Always include appropriate disclaimers about building codes and professional consultation requirements.

REQUIRED DISCLAIMERS:
- Building code guidance is general only and varies by local jurisdiction
- Professional inspection recommended for code compliance verification
- This report is not a substitute for official building inspection
- Consult local authorities and licensed professionals for official determinations

Output valid JSON with this structure:
{
  "report_markdown": "string (full markdown content)",
  "report_summary_json": {
    "headline": "string (one sentence summary)",
    "code_violations_found": number,
    "priority_issues": number,
    "recommendations": ["string", "string"]
  }
}"""
    
    async def process(
        self,
        inspection_id: Optional[str],
        property: Optional[Property],
        issues_enriched: List[dict],
        summary: dict
    ) -> dict:
        """
        Generate markdown report and summary.
        
        Returns:
            dict with inspection_id, report_markdown, report_summary_json
        """
        # Build property info
        property_info = ""
        if property:
            if property.name:
                property_info += f"Property: {property.name}\n"
            if property.address_line1:
                property_info += f"Address: {property.address_line1}\n"
            if property.city and property.state:
                property_info += f"Location: {property.city}, {property.state}"
                if property.postal_code:
                    property_info += f" {property.postal_code}"
                property_info += "\n"
        
        # Build prompt
        user_message = f"""Generate an inspection report.

{property_info}

Summary:
{json.dumps(summary, indent=2)}

Issues:
{json.dumps(issues_enriched, indent=2)}
"""
        
        messages = [
            {"role": "system", "content": self._build_system_prompt()},
            {"role": "user", "content": user_message}
        ]
        
        # Call OpenAI
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=4096,
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            return {
                "inspection_id": inspection_id,
                "report_markdown": result.get("report_markdown", ""),
                "report_summary_json": result.get("report_summary_json", {
                    "headline": "Inspection complete",
                    "recommendations": []
                })
            }
        except json.JSONDecodeError:
            return {
                "inspection_id": inspection_id,
                "report_markdown": "# Error generating report",
                "report_summary_json": {
                    "headline": "Error generating report",
                    "recommendations": []
                }
            }
