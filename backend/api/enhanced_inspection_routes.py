from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.database.database import get_db
from backend.database.models import (
    User, Property, Inspection, InspectionChecklist, InspectionTest, 
    TestResult, SystemDiagnostic, MeasurementReading, InspectionTemplate,
    TestType, TestResult as TestResultEnum, MeasurementUnit
)
from backend.schemas.inspection_extended import (
    InspectionTest as InspectionTestSchema,
    InspectionChecklist as InspectionChecklistSchema,
    TestResult as TestResultSchema,
    SystemDiagnostic as SystemDiagnosticSchema,
    EnhancedInspectionReport,
    InspectionTemplate as InspectionTemplateSchema
)
from backend.auth.auth import get_current_active_user
from backend.services.tool_integration_service import tool_integration_service
from backend.data.inspection_checklists import ALL_CHECKLISTS, get_checklist_for_property
import json

router = APIRouter(prefix="/enhanced-inspections", tags=["enhanced-inspections"])


# Tool Integration Endpoints

@router.get("/tools/available")
async def get_available_tools(
    current_user: User = Depends(get_current_active_user)
):
    """Get list of available professional tools."""
    return await tool_integration_service.get_available_tools()


@router.post("/tools/{tool_id}/connect")
async def connect_tool(
    tool_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Connect to a professional tool."""
    return await tool_integration_service.connect_tool(tool_id)


@router.post("/tools/{tool_id}/reading")
async def input_tool_reading(
    tool_id: str,
    reading_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user)
):
    """Input a manual reading from a professional tool."""
    
    reading = await tool_integration_service.input_manual_reading(
        tool_id=tool_id,
        measurement_type=reading_data["measurement_type"],
        value=reading_data["value"],
        unit=reading_data["unit"],
        location=reading_data.get("location"),
        conditions=reading_data.get("conditions"),
        tool_model=reading_data.get("tool_model")
    )
    
    # Validate the reading
    validation = await tool_integration_service.validate_reading(
        reading, 
        reading_data.get("expected_range")
    )
    
    return {
        "reading": {
            "tool_type": reading.tool_type.value,
            "measurement_type": reading.measurement_type,
            "value": reading.value,
            "unit": reading.unit.value,
            "timestamp": reading.timestamp.isoformat(),
            "location": reading.location,
            "tool_model": reading.tool_model,
            "conditions": reading.conditions
        },
        "validation": validation
    }


@router.get("/tools/recommendations")
async def get_tool_recommendations(
    test_type: str,
    measurement_type: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get recommended tools for a specific test."""
    return await tool_integration_service.get_tool_recommendations(test_type, measurement_type)


@router.get("/checklists", response_model=List[InspectionChecklistSchema])
async def get_available_checklists(
    property_type: Optional[str] = None,
    year_built: Optional[int] = None,
    climate_zone: Optional[str] = "temperate",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get available inspection checklists, optionally filtered by property characteristics."""
    
    if property_type and year_built:
        # Get property-specific checklists
        applicable_checklists = get_checklist_for_property(property_type, year_built, climate_zone)
        return applicable_checklists
    else:
        # Return all available checklists
        return list(ALL_CHECKLISTS.values())


@router.get("/checklists/{checklist_id}", response_model=InspectionChecklistSchema)
async def get_checklist_details(
    checklist_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get detailed information about a specific checklist."""
    
    if checklist_id not in ALL_CHECKLISTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    return ALL_CHECKLISTS[checklist_id]


@router.get("/checklists/{checklist_id}/tests")
async def get_checklist_tests(
    checklist_id: str,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all tests for a specific checklist, optionally filtered by category."""
    
    if checklist_id not in ALL_CHECKLISTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist not found"
        )
    
    checklist = ALL_CHECKLISTS[checklist_id]
    
    if category:
        if category not in checklist.categories:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found in checklist"
            )
        return {category: checklist.categories[category]}
    
    return checklist.categories


@router.post("/inspections/{inspection_id}/tests")
async def save_test_result(
    inspection_id: int,
    test_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Save the result of a specific test."""
    
    # Verify inspection exists and user has access
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found or access denied"
        )
    
    # Create or update test result
    test_result = db.query(TestResult).filter(
        TestResult.inspection_id == inspection_id,
        TestResult.test_id == test_data.get("test_id")
    ).first()
    
    if not test_result:
        test_result = TestResult(
            inspection_id=inspection_id,
            test_id=test_data.get("test_id"),
            tested_by=current_user.id
        )
        db.add(test_result)
    
    # Update test result data
    test_result.result = test_data.get("result", TestResultEnum.NOT_TESTED)
    test_result.measured_value = test_data.get("measured_value")
    test_result.notes = test_data.get("notes")
    test_result.photos = test_data.get("photos", [])
    test_result.tested_at = test_data.get("timestamp")
    
    # AI analysis of the result
    if test_result.result in [TestResultEnum.FAIL, TestResultEnum.WARNING]:
        test_result.ai_analysis = await analyze_test_failure(test_data)
        test_result.risk_level = determine_risk_level(test_data)
    
    db.commit()
    db.refresh(test_result)
    
    return {
        "message": "Test result saved successfully",
        "test_result_id": test_result.id,
        "ai_analysis": test_result.ai_analysis,
        "risk_level": test_result.risk_level
    }


@router.get("/inspections/{inspection_id}/results")
async def get_inspection_test_results(
    inspection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all test results for an inspection."""
    
    # Verify inspection access
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found or access denied"
        )
    
    # Get all test results
    test_results = db.query(TestResult).filter(
        TestResult.inspection_id == inspection_id
    ).all()
    
    # Get system diagnostics
    system_diagnostics = db.query(SystemDiagnostic).filter(
        SystemDiagnostic.inspection_id == inspection_id
    ).all()
    
    return {
        "inspection_id": inspection_id,
        "test_results": test_results,
        "system_diagnostics": system_diagnostics,
        "summary": generate_inspection_summary(test_results, system_diagnostics)
    }


@router.post("/inspections/{inspection_id}/analyze")
async def analyze_inspection_systems(
    inspection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Analyze all test results and generate system diagnostics."""
    
    # Verify inspection access
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found or access denied"
        )
    
    # Get all test results
    test_results = db.query(TestResult).filter(
        TestResult.inspection_id == inspection_id
    ).all()
    
    if not test_results:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No test results found for analysis"
        )
    
    # Analyze by system
    systems_analysis = await analyze_systems_performance(test_results)
    
    # Save system diagnostics
    for system_name, analysis in systems_analysis.items():
        # Remove existing diagnostic for this system
        db.query(SystemDiagnostic).filter(
            SystemDiagnostic.inspection_id == inspection_id,
            SystemDiagnostic.system_name == system_name
        ).delete()
        
        # Create new diagnostic
        diagnostic = SystemDiagnostic(
            inspection_id=inspection_id,
            system_name=system_name,
            overall_condition=analysis["condition"],
            efficiency_rating=analysis["efficiency"],
            safety_score=analysis["safety"],
            code_compliance=analysis["compliance"],
            critical_issues=analysis["critical_issues"],
            warnings=analysis["warnings"],
            recommendations=analysis["recommendations"],
            immediate_repairs=analysis["repair_cost"],
            preventive_maintenance=analysis["maintenance_cost"],
            replacement_timeline=analysis["replacement_timeline"],
            ai_summary=analysis["summary"],
            confidence_score=analysis["confidence"]
        )
        db.add(diagnostic)
    
    db.commit()
    
    return {
        "message": "System analysis completed",
        "systems_analyzed": list(systems_analysis.keys()),
        "overall_score": calculate_overall_property_score(systems_analysis)
    }


@router.get("/templates", response_model=List[InspectionTemplateSchema])
async def get_inspection_templates(
    property_type: Optional[str] = None,
    purpose: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get available inspection templates."""
    
    # For now, return predefined templates
    # In production, these would be stored in database
    templates = [
        {
            "id": "comprehensive_purchase",
            "name": "Comprehensive Pre-Purchase Inspection",
            "description": "Complete inspection including all systems testing for property purchase",
            "property_types": ["single_family", "condo", "townhouse"],
            "inspection_purposes": ["purchase", "pre_sale"],
            "visual_inspection": True,
            "system_testing": True,
            "measurements": True,
            "code_compliance": True,
            "required_checklists": ["hvac", "electrical", "plumbing", "safety"],
            "optional_checklists": [],
            "custom_tests": [],
            "regional_requirements": {}
        },
        {
            "id": "maintenance_check",
            "name": "Annual Maintenance Inspection",
            "description": "Routine maintenance inspection focusing on system performance",
            "property_types": ["single_family", "condo", "townhouse"],
            "inspection_purposes": ["maintenance", "insurance"],
            "visual_inspection": True,
            "system_testing": True,
            "measurements": True,
            "code_compliance": False,
            "required_checklists": ["hvac", "safety"],
            "optional_checklists": ["electrical", "plumbing"],
            "custom_tests": [],
            "regional_requirements": {}
        },
        {
            "id": "rental_turnover",
            "name": "Rental Property Turnover",
            "description": "Quick but thorough inspection for rental property turnover",
            "property_types": ["single_family", "condo", "townhouse", "apartment"],
            "inspection_purposes": ["rental", "move_in", "move_out"],
            "visual_inspection": True,
            "system_testing": False,
            "measurements": False,
            "code_compliance": True,
            "required_checklists": ["safety"],
            "optional_checklists": ["hvac", "electrical", "plumbing"],
            "custom_tests": [],
            "regional_requirements": {}
        }
    ]
    
    # Filter by criteria if provided
    if property_type:
        templates = [t for t in templates if property_type in t["property_types"]]
    
    if purpose:
        templates = [t for t in templates if purpose in t["inspection_purposes"]]
    
    return templates


@router.post("/inspections/{inspection_id}/measurements")
async def save_measurement_reading(
    inspection_id: int,
    measurement_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Save a measurement reading from professional tools."""
    
    # Verify inspection access
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.inspector_id == current_user.id
    ).first()
    
    if not inspection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inspection not found or access denied"
        )
    
    # Find the associated test result
    test_result = db.query(TestResult).filter(
        TestResult.inspection_id == inspection_id,
        TestResult.test_id == measurement_data.get("test_id")
    ).first()
    
    if not test_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test result not found"
        )
    
    # Create measurement reading
    measurement = MeasurementReading(
        test_result_id=test_result.id,
        measurement_type=measurement_data["measurement_type"],
        value=measurement_data["value"],
        unit=measurement_data["unit"],
        location=measurement_data.get("location"),
        tool_used=measurement_data.get("tool_used"),
        calibration_date=measurement_data.get("calibration_date"),
        conditions=measurement_data.get("conditions"),
        notes=measurement_data.get("notes"),
        measured_at=measurement_data["measured_at"]
    )
    
    db.add(measurement)
    db.commit()
    db.refresh(measurement)
    
    return {
        "message": "Measurement saved successfully",
        "measurement_id": measurement.id
    }


# Helper functions for AI analysis

async def analyze_test_failure(test_data: Dict[str, Any]) -> str:
    """Analyze why a test failed and provide recommendations."""
    
    # This would integrate with your AI service
    # For now, return basic analysis based on test type
    
    test_type = test_data.get("test_type")
    measured_value = test_data.get("measured_value")
    expected_range = test_data.get("acceptable_range", {})
    
    if test_type == "measurement" and measured_value and expected_range:
        min_val = expected_range.get("min", 0)
        max_val = expected_range.get("max", float('inf'))
        
        if measured_value < min_val:
            return f"Measured value ({measured_value}) is below acceptable minimum ({min_val}). This may indicate system underperformance or component failure."
        elif measured_value > max_val:
            return f"Measured value ({measured_value}) exceeds acceptable maximum ({max_val}). This may indicate system overload or safety concern."
    
    return "Test failed - manual review recommended by qualified professional."


def determine_risk_level(test_data: Dict[str, Any]) -> str:
    """Determine risk level based on test results."""
    
    test_category = test_data.get("category", "").lower()
    result = test_data.get("result")
    
    if result == TestResultEnum.FAIL:
        if "electrical" in test_category or "safety" in test_category:
            return "critical"
        elif "hvac" in test_category or "plumbing" in test_category:
            return "high"
        else:
            return "medium"
    elif result == TestResultEnum.WARNING:
        return "medium"
    else:
        return "low"


async def analyze_systems_performance(test_results: List[TestResult]) -> Dict[str, Dict[str, Any]]:
    """Analyze overall system performance based on test results."""
    
    systems_analysis = {}
    
    # Group test results by system
    systems = {}
    for result in test_results:
        # This would need to be enhanced to properly categorize tests by system
        system = "General"  # Placeholder
        if system not in systems:
            systems[system] = []
        systems[system].append(result)
    
    # Analyze each system
    for system_name, results in systems.items():
        pass_count = sum(1 for r in results if r.result == TestResultEnum.PASS)
        fail_count = sum(1 for r in results if r.result == TestResultEnum.FAIL)
        warning_count = sum(1 for r in results if r.result == TestResultEnum.WARNING)
        total_tests = len(results)
        
        # Calculate scores
        pass_rate = pass_count / total_tests if total_tests > 0 else 0
        
        # Determine overall condition
        if pass_rate >= 0.9:
            condition = "excellent"
        elif pass_rate >= 0.8:
            condition = "good"
        elif pass_rate >= 0.6:
            condition = "fair"
        elif pass_rate >= 0.4:
            condition = "poor"
        else:
            condition = "critical"
        
        systems_analysis[system_name] = {
            "condition": condition,
            "efficiency": pass_rate,
            "safety": 1.0 - (fail_count / total_tests) if total_tests > 0 else 1.0,
            "compliance": fail_count == 0,
            "critical_issues": [r.notes for r in results if r.result == TestResultEnum.FAIL and r.notes],
            "warnings": [r.notes for r in results if r.result == TestResultEnum.WARNING and r.notes],
            "recommendations": generate_system_recommendations(system_name, results),
            "repair_cost": estimate_repair_costs(results),
            "maintenance_cost": estimate_maintenance_costs(results),
            "replacement_timeline": estimate_replacement_timeline(condition),
            "summary": f"System shows {condition} condition with {pass_rate:.1%} pass rate",
            "confidence": min(0.8, total_tests / 10)  # Higher confidence with more tests
        }
    
    return systems_analysis


def generate_system_recommendations(system_name: str, results: List[TestResult]) -> List[str]:
    """Generate recommendations based on test results."""
    recommendations = []
    
    for result in results:
        if result.result == TestResultEnum.FAIL:
            recommendations.append(f"Address failed test: {result.notes or 'Professional inspection recommended'}")
        elif result.result == TestResultEnum.WARNING:
            recommendations.append(f"Monitor: {result.notes or 'Schedule follow-up inspection'}")
    
    return recommendations


def estimate_repair_costs(results: List[TestResult]) -> float:
    """Estimate immediate repair costs based on failed tests."""
    # This would integrate with cost databases
    # For now, return basic estimates
    
    fail_count = sum(1 for r in results if r.result == TestResultEnum.FAIL)
    return fail_count * 500.0  # $500 average per failed test


def estimate_maintenance_costs(results: List[TestResult]) -> float:
    """Estimate preventive maintenance costs."""
    warning_count = sum(1 for r in results if r.result == TestResultEnum.WARNING)
    return warning_count * 200.0  # $200 average per warning


def estimate_replacement_timeline(condition: str) -> str:
    """Estimate when system replacement might be needed."""
    timelines = {
        "excellent": "10+ years",
        "good": "5-10 years",
        "fair": "2-5 years",
        "poor": "1-2 years",
        "critical": "immediate"
    }
    return timelines.get(condition, "unknown")


def calculate_overall_property_score(systems_analysis: Dict[str, Dict[str, Any]]) -> float:
    """Calculate overall property condition score."""
    if not systems_analysis:
        return 0.0
    
    total_efficiency = sum(analysis["efficiency"] for analysis in systems_analysis.values())
    return total_efficiency / len(systems_analysis)


def generate_inspection_summary(test_results: List[TestResult], system_diagnostics: List[SystemDiagnostic]) -> Dict[str, Any]:
    """Generate a summary of the inspection results."""
    
    total_tests = len(test_results)
    passed_tests = sum(1 for r in test_results if r.result == TestResultEnum.PASS)
    failed_tests = sum(1 for r in test_results if r.result == TestResultEnum.FAIL)
    warning_tests = sum(1 for r in test_results if r.result == TestResultEnum.WARNING)
    
    critical_issues = []
    for diagnostic in system_diagnostics:
        if diagnostic.critical_issues:
            critical_issues.extend(diagnostic.critical_issues)
    
    return {
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": failed_tests,
        "warning_tests": warning_tests,
        "pass_rate": passed_tests / total_tests if total_tests > 0 else 0,
        "critical_issues_count": len(critical_issues),
        "systems_analyzed": len(system_diagnostics),
        "overall_condition": determine_overall_condition(system_diagnostics),
        "immediate_action_required": failed_tests > 0 or len(critical_issues) > 0
    }


def determine_overall_condition(system_diagnostics: List[SystemDiagnostic]) -> str:
    """Determine overall property condition based on system diagnostics."""
    if not system_diagnostics:
        return "unknown"
    
    conditions = [d.overall_condition for d in system_diagnostics if d.overall_condition]
    
    if "critical" in conditions:
        return "critical"
    elif "poor" in conditions:
        return "poor"
    elif "fair" in conditions:
        return "fair"
    elif "good" in conditions:
        return "good"
    else:
        return "excellent"