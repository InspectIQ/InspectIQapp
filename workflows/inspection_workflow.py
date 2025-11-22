from typing import Optional
import httpx
from schemas.inspection import InspectionInput
from agents import (
    MediaIngestionAgent,
    InspectionVisionAgent,
    InspectionRepairScopeAgent,
    InspectionReportAgent
)
from config.settings import get_settings


class InspectionWorkflow:
    """Orchestrates the inspection analysis workflow."""
    
    def __init__(self):
        self.settings = get_settings()
        self.media_agent = MediaIngestionAgent()
        self.vision_agent = InspectionVisionAgent()
        self.repair_scope_agent = InspectionRepairScopeAgent()
        self.report_agent = InspectionReportAgent()
    
    async def run(self, input_data: InspectionInput) -> dict:
        """
        Execute the full inspection workflow.
        
        Steps:
        1. Media ingestion
        2. Vision analysis
        3. Repair scope
        4. Report generation
        5. Webhook callback
        
        Returns:
            Complete inspection results
        """
        # Step 1: Media Ingestion
        media_result = await self.media_agent.process(
            photos=input_data.photos,
            inspection_id=input_data.inspection_id
        )
        
        processed_photos = media_result["processed_photos"]
        inspection_id = media_result["inspection_id"]
        
        if not processed_photos:
            return {
                "inspection_id": inspection_id,
                "error": "No valid photos provided"
            }
        
        # Step 2: Vision Analysis
        vision_result = await self.vision_agent.process(
            inspection_id=inspection_id,
            processed_photos=processed_photos,
            property_context=input_data.property_context
        )
        
        issues = vision_result["issues"]
        
        # Step 3: Repair Scope
        repair_result = await self.repair_scope_agent.process(
            inspection_id=inspection_id,
            issues=issues,
            property_context=input_data.property_context
        )
        
        issues_enriched = repair_result["issues_enriched"]
        summary = repair_result["summary"]
        
        # Step 4: Report Generation
        report_result = await self.report_agent.process(
            inspection_id=inspection_id,
            property=input_data.property,
            issues_enriched=issues_enriched,
            summary=summary
        )
        
        # Step 5: Webhook Callback
        final_payload = {
            "inspection_id": inspection_id,
            "report_markdown": report_result["report_markdown"],
            "report_summary_json": report_result["report_summary_json"],
            "issues_enriched": issues_enriched,
            "summary": summary
        }
        
        await self._send_webhook(final_payload)
        
        return final_payload
    
    async def _send_webhook(self, payload: dict) -> None:
        """Send results to backend webhook."""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.settings.inspection_webhook_url,
                    json=payload
                )
                response.raise_for_status()
        except Exception as e:
            # Log error but don't fail the workflow
            print(f"Webhook error: {e}")
