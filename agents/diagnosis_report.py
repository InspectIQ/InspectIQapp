from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import Property
from schemas.diagnosis import DiagnosisReport
from config.settings import get_settings
import json


class DiagnosisReportAgent:
    """Converts enriched diagnosis into markdown report + JSON summary."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4-turbo-preview"
    
    def _build_system_prompt(self) -> str:
        return """You are the Maintenance Diagnosis Report Agent for InspectIQ. Generate a friendly, consumer-focused markdown report that:

- Summarizes what the issue most likely is
- Explains how urgent it is
- Gives clear, practical next steps
- Includes estimated cost and time

Structure:
## InspectIQ Maintenance Diagnosis
### Summary (1–3 short paragraphs)
### What We Think Is Happening
### How Urgent Is It?
### Recommended Next Steps (bullets)
### Estimated Cost & Time
### Safety Notes if any

Avoid legal or insurance advice.

Output JSON with this structure:
{
  "report_markdown": "string (full markdown content)",
  "report_summary_json": {
    "headline": "string (one sentence)",
    "recommended_next_step": "string (one sentence)"
  }
}"""
    
    async def process(
        self,
        diagnosis_id: Optional[str],
        property: Optional[Property],
        diagnosis_summary: str,
        issues_enriched: List[dict],
        summary: dict
    ) -> dict:
        """
        Generate markdown report and summary.
        
        Returns:
            dict with diagnosis_id, report_markdown, report_summary_json
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
        user_message = f"""Generate a maintenance diagnosis report.

{property_info}

Diagnosis Summary:
{diagnosis_summary}

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
                "diagnosis_id": diagnosis_id,
                "report_markdown": result.get("report_markdown", ""),
                "report_summary_json": result.get("report_summary_json", {
                    "headline": "Diagnosis complete",
                    "recommended_next_step": "Review the report"
                })
            }
        except json.JSONDecodeError:
            return {
                "diagnosis_id": diagnosis_id,
                "report_markdown": "# Error generating report",
                "report_summary_json": {
                    "headline": "Error generating report",
                    "recommended_next_step": "Please try again"
                }
            }
