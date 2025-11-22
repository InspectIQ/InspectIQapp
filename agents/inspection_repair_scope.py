from typing import List, Optional
from openai import AsyncOpenAI
from schemas.common import PropertyContext
from schemas.inspection import InspectionIssue, InspectionIssueEnriched, InspectionSummary
from config.settings import get_settings
import json


class InspectionRepairScopeAgent:
    """Converts detected issues into actionable repairs with cost/time estimates."""
    
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4-turbo-preview"
    
    def _build_system_prompt(self) -> str:
        return """You are the Repair Scope Agent for InspectIQ inspections. You receive a list of issues detected by the vision system. Your job is to:

For each issue, recommend:
- A practical action to address it
- Whether it is realistically DIY or should involve a professional
- The most appropriate trade (e.g., "painter", "plumber", "handyman", "flooring")
- A reasonable cost range in USD and time estimate in hours for a typical U.S. market
- Materials for small DIY fixes when DIY is possible

Then compute a summary containing:
- issue_count (total number of issues)
- summary_severity (highest severity among all issues)
- summary_cost_low and summary_cost_high (sum of all issue cost ranges)

Use conservative but realistic estimates.

Output ONLY valid JSON with this structure:
{
  "issues_enriched": [
    {
      "image_url": "string",
      "room_name": "string or null",
      "issue_type": "string",
      "description": "string",
      "severity": "string",
      "recommended_action": "string",
      "recommended_trade": "string",
      "diy_possible": boolean,
      "cost_low": number,
      "cost_high": number,
      "time_hours": number,
      "materials_list": ["string"],
      "safety_warnings": "string or null"
    }
  ],
  "summary": {
    "issue_count": number,
    "summary_severity": "string",
    "summary_cost_low": number,
    "summary_cost_high": number
  }
}"""

    async def process(
        self,
        inspection_id: Optional[str],
        issues: List[dict],
        property_context: Optional[PropertyContext] = None
    ) -> dict:
        """
        Enrich issues with repair recommendations and cost estimates.
        
        Returns:
            dict with inspection_id, issues_enriched, and summary
        """
        if not issues:
            return {
                "inspection_id": inspection_id,
                "issues_enriched": [],
                "summary": {
                    "issue_count": 0,
                    "summary_severity": "low",
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
        user_message = f"{context_info}\n\nAnalyze these {len(issues)} detected issues and provide repair recommendations:\n\n"
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
                "inspection_id": inspection_id,
                "issues_enriched": result.get("issues_enriched", []),
                "summary": result.get("summary", {
                    "issue_count": len(issues),
                    "summary_severity": "medium",
                    "summary_cost_low": 0.0,
                    "summary_cost_high": 0.0
                })
            }
        except json.JSONDecodeError:
            # Fallback
            return {
                "inspection_id": inspection_id,
                "issues_enriched": [],
                "summary": {
                    "issue_count": len(issues),
                    "summary_severity": "medium",
                    "summary_cost_low": 0.0,
                    "summary_cost_high": 0.0
                }
            }
