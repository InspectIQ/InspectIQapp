from typing import Optional
import httpx
from schemas.diagnosis import DiagnosisInput
from agents import (
    MediaIngestionAgent,
    MaintenanceDiagnosisAgent,
    DiagnosisRepairScopeAgent,
    DiagnosisReportAgent
)
from config.settings import get_settings


class DiagnosisWorkflow:
    """Orchestrates the maintenance diagnosis workflow."""
    
    def __init__(self):
        self.settings = get_settings()
        self.media_agent = MediaIngestionAgent()
        self.diagnosis_agent = MaintenanceDiagnosisAgent()
        self.repair_scope_agent = DiagnosisRepairScopeAgent()
        self.report_agent = DiagnosisReportAgent()
    
    async def run(self, input_data: DiagnosisInput) -> dict:
        """
        Execute the full diagnosis workflow.
        
        Steps:
        1. Media ingestion
        2. Maintenance diagnosis
        3. Repair scope
        4. Report generation
        5. Webhook callback
        
        Returns:
            Complete diagnosis results
        """
        # Step 1: Media Ingestion
        media_result = await self.media_agent.process(
            photos=input_data.photos,
            diagnosis_id=input_data.diagnosis_id
        )
        
        processed_photos = media_result["processed_photos"]
        diagnosis_id = media_result["diagnosis_id"]
        
        if not processed_photos:
            return {
                "diagnosis_id": diagnosis_id,
                "error": "No valid photos provided"
            }
        
        # Step 2: Maintenance Diagnosis
        diagnosis_result = await self.diagnosis_agent.process(
            diagnosis_id=diagnosis_id,
            processed_photos=processed_photos,
            user_description=input_data.user_description,
            property_context=input_data.property_context
        )
        
        diagnosis_summary = diagnosis_result["diagnosis_summary"]
        issues = diagnosis_result["issues"]
        
        # Step 3: Repair Scope
        repair_result = await self.repair_scope_agent.process(
            diagnosis_id=diagnosis_id,
            issues=issues,
            property_context=input_data.property_context
        )
        
        issues_enriched = repair_result["issues_enriched"]
        summary = repair_result["summary"]
        
        # Step 4: Report Generation
        report_result = await self.report_agent.process(
            diagnosis_id=diagnosis_id,
            property=input_data.property,
            diagnosis_summary=diagnosis_summary,
            issues_enriched=issues_enriched,
            summary=summary
        )
        
        # Step 5: Webhook Callback
        final_payload = {
            "diagnosis_id": diagnosis_id,
            "report_markdown": report_result["report_markdown"],
            "report_summary_json": report_result["report_summary_json"],
            "diagnosis_summary": diagnosis_summary,
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
                    self.settings.diagnosis_webhook_url,
                    json=payload
                )
                response.raise_for_status()
        except Exception as e:
            # Log error but don't fail the workflow
            print(f"Webhook error: {e}")
