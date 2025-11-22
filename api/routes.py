from fastapi import APIRouter, HTTPException
from schemas.inspection import InspectionInput
from schemas.diagnosis import DiagnosisInput
from workflows import InspectionWorkflow, DiagnosisWorkflow

router = APIRouter(prefix="/api/v1")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "InspectIQ"}


@router.post("/workflows/inspection")
async def run_inspection_analysis(input_data: InspectionInput):
    """
    Run inspection analysis workflow.
    
    Analyzes property photos for damage and generates a detailed report.
    """
    try:
        workflow = InspectionWorkflow()
        result = await workflow.run(input_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/workflows/diagnosis")
async def run_diagnosis_analysis(input_data: DiagnosisInput):
    """
    Run maintenance diagnosis workflow.
    
    Diagnoses maintenance issues from photos and user description.
    """
    try:
        workflow = DiagnosisWorkflow()
        result = await workflow.run(input_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
