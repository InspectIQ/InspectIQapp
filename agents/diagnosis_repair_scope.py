from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import PropertyContext
from schemas.diagnosis import DiagnosisIssue, DiagnosisIssueEnriched, DiagnosisSummary
from config.settings import get_settings
import json


class DiagnosisRepairScopeAgent:
    """Converts diagnosis into repair recommendations with cost/time estimates."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4-turbo-preview"
    
    def _build_system_prompt(self) -> str:
        return """You are the Repair Scope Agent for InspectIQ maintenance diagnoses. You receive high-level issues such as "ceiling leak" or "possible mold" along with system and urgency. Your tasks:

For each issue, decide:
- Whether DIY is realistically safe and feasible
- The appropriate trade (plumber, roofer, electrician, hvac, handyman, etc.)
- Estimated cost range in USD and time in hours for a typical U.S. household
- Any necessary safety warnings
- A short, practical list of steps the user should take next, in order

Then compute a summary with:
- overall_urgency (the highest urgency)
- summary_cost_low and summary_cost_high (sum of all issue costs)

Keep language simple and reassuring.

Output valid JSON with this structure:
{
  "issues_enriched": [
    {
      "issue_label": "string",
      "system": "string",
      "urgency": "string",
      "probable_cause": "string",
      "diy_possible": boolean,
      "recommended_trade": "string",
      "cost_low": number,
      "cost_high": number,
      "time_hours": number,
      "materials_list": ["string"],
      "safety_warnings": "string or null",
      "steps": ["string", "string"]
    }
  ],
  "summary": {
    "overall_urgency": "string",
    "summary_cost_low": number,
    "summary_cost_high": number
  }
}"""

    async def process(
        self,
        diagnosis_id: Optional[str],
        issues: List[dict],
        property_context: Optional[PropertyContext] = None
    ) -> dict:
        """
        Enrich diagnosis issues with repair recommendations.
        
        Returns:
            dict with diagnosis_id, issues_enriched, and summary
        """
        if not issues:
            return {
                "diagnosis_id": diagnosis_id,
                "issues_enriched": [],
                "summary": {
                    "overall_urgency": "low",
                    "summary_cost_low": 0.0,
                    "summary_cost_high": 0.0
                }
            }
        
        # Build context
        context_info = ""
        if property_context:
            if property_context.state:
                context_info += f"State: {property_context.state}. "
            if property_context.property_type:
                context_info += f"Property type: {property_context.property_type}. "
        
        # Build prompt
        user_message = f"{context_info}\n\nProvide repair recommendations for these diagnosed issues:\n\n"
        user_message += json.dumps(issues, indent=2)
        
        messages = [
            {"role": "system", "content": self._build_system_prompt()},
            {"role": "user", "content": user_message}
        ]
        
        # Call OpenAI
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=4096,
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        content = response.choices[0].message.content
        try:
            result = json.loads(content)
            return {
                "diagnosis_id": diagnosis_id,
                "issues_enriched": result.get("issues_enriched", []),
                "summary": result.get("summary", {
                    "overall_urgency": "medium",
                    "summary_cost_low": 0.0,
                    "summary_cost_high": 0.0
                })
            }
        except json.JSONDecodeError:
            return {
                "diagnosis_id": diagnosis_id,
                "issues_enriched": [],
                "summary": {
                    "overall_urgency": "medium",
                    "summary_cost_low": 0.0,
                    "summary_cost_high": 0.0
                }
            }
