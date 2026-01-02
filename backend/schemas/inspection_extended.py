from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime


class TestType(str, Enum):
    VISUAL = "visual"
    MEASUREMENT = "measurement"
    FUNCTIONAL = "functional"
    SAFETY = "safety"
    DIAGNOSTIC = "diagnostic"


class TestResult(str, Enum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_TESTED = "not_tested"
    NOT_APPLICABLE = "not_applicable"


class MeasurementUnit(str, Enum):
    PSI = "psi"
    VOLTS = "volts"
    AMPS = "amps"
    FAHRENHEIT = "fahrenheit"
    CELSIUS = "celsius"
    PERCENT = "percent"
    DECIBELS = "decibels"
    PPM = "ppm"  # Parts per million
    CFM = "cfm"  # Cubic feet per minute


class InspectionTest(BaseModel):
    """Individual test within an inspection checklist."""
    id: str
    name: str
    description: str
    test_type: TestType
    category: str  # HVAC, Electrical, Plumbing, etc.
    
    # Test parameters
    instructions: str
    safety_notes: Optional[str] = None
    required_tools: List[str] = []
    
    # Expected results
    expected_result: Optional[str] = None
    acceptable_range: Optional[Dict[str, float]] = None  # {"min": 110, "max": 120}
    measurement_unit: Optional[MeasurementUnit] = None
    
    # Actual results
    result: Optional[TestResult] = None
    measured_value: Optional[float] = None
    notes: Optional[str] = None
    photos: List[str] = []
    timestamp: Optional[datetime] = None
    
    # AI analysis
    ai_analysis: Optional[str] = None
    risk_level: Optional[str] = None  # low, medium, high, critical


class InspectionChecklist(BaseModel):
    """Complete checklist for a specific inspection type."""
    id: str
    name: str
    description: str
    property_types: List[str]  # single_family, condo, commercial
    applicable_years: Optional[Dict[str, int]] = None  # {"min": 1950, "max": 2024}
    climate_zones: List[str] = []  # cold, hot, humid, dry
    
    categories: Dict[str, List[InspectionTest]]
    estimated_time: int  # minutes
    required_certifications: List[str] = []


class SystemDiagnostic(BaseModel):
    """Diagnostic results for building systems."""
    system_name: str  # HVAC, Electrical, Plumbing
    overall_condition: str  # excellent, good, fair, poor, critical
    
    # Performance metrics
    efficiency_rating: Optional[float] = None
    safety_score: Optional[float] = None
    code_compliance: Optional[bool] = None
    
    # Issues found
    critical_issues: List[str] = []
    warnings: List[str] = []
    recommendations: List[str] = []
    
    # Cost estimates
    immediate_repairs: Optional[float] = None
    preventive_maintenance: Optional[float] = None
    replacement_timeline: Optional[str] = None


class EnhancedInspectionReport(BaseModel):
    """Extended inspection report with non-visual testing."""
    inspection_id: int
    
    # Visual inspection (existing)
    rooms: List[Dict[str, Any]]
    photos: List[str]
    
    # Non-visual testing (new)
    checklists_completed: List[str]
    test_results: List[InspectionTest]
    system_diagnostics: List[SystemDiagnostic]
    
    # Measurements and readings
    measurements: Dict[str, Dict[str, Any]]  # {"water_pressure": {"main": 65, "unit": "psi"}}
    
    # Professional findings
    inspector_notes: str
    safety_concerns: List[str]
    code_violations: List[str]
    
    # AI analysis
    ai_summary: str
    risk_assessment: Dict[str, str]
    priority_repairs: List[Dict[str, Any]]
    
    # Report metadata
    inspection_duration: int  # minutes
    weather_conditions: Optional[str] = None
    tools_used: List[str] = []
    certifications_verified: List[str] = []


class InspectionTemplate(BaseModel):
    """Template for different inspection types."""
    id: str
    name: str
    description: str
    
    # Applicability
    property_types: List[str]
    inspection_purposes: List[str]  # purchase, maintenance, insurance, rental
    
    # Required components
    visual_inspection: bool = True
    system_testing: bool = True
    measurements: bool = True
    code_compliance: bool = True
    
    # Checklists to include
    required_checklists: List[str]
    optional_checklists: List[str]
    
    # Customization
    custom_tests: List[InspectionTest] = []
    regional_requirements: Dict[str, List[str]] = {}