"""
Professional inspection checklists for non-visual testing.
Based on industry standards and real estate professional feedback.
"""

from backend.schemas.inspection_extended import (
    InspectionChecklist, InspectionTest, TestType, MeasurementUnit
)

# HVAC System Inspection Checklist
HVAC_CHECKLIST = InspectionChecklist(
    id="hvac_comprehensive",
    name="HVAC System Comprehensive Inspection",
    description="Complete heating, ventilation, and air conditioning system evaluation",
    property_types=["single_family", "condo", "townhouse"],
    applicable_years={"min": 1950, "max": 2024},
    climate_zones=["all"],
    estimated_time=45,
    categories={
        "Heating System": [
            InspectionTest(
                id="heat_functionality",
                name="Heating System Functionality",
                description="Test heating system operation and temperature rise",
                test_type=TestType.FUNCTIONAL,
                category="HVAC",
                instructions="1. Set thermostat 10°F above current temp\n2. Wait 10 minutes\n3. Measure temperature at supply vents\n4. Check for even heating across zones",
                safety_notes="Ensure proper ventilation. Check for gas leaks before testing.",
                required_tools=["digital thermometer", "infrared thermometer"],
                expected_result="Temperature rise of 15-25°F at vents",
                acceptable_range={"min": 15.0, "max": 25.0},
                measurement_unit=MeasurementUnit.FAHRENHEIT
            ),
            InspectionTest(
                id="air_flow_measurement",
                name="Air Flow Measurement",
                description="Measure air velocity at supply and return vents",
                test_type=TestType.MEASUREMENT,
                category="HVAC",
                instructions="Use anemometer to measure air velocity at each vent",
                required_tools=["anemometer"],
                expected_result="Supply vents: 300-750 CFM, Return vents: 200-500 CFM",
                measurement_unit=MeasurementUnit.CFM
            ),
            InspectionTest(
                id="thermostat_calibration",
                name="Thermostat Calibration",
                description="Verify thermostat accuracy and response time",
                test_type=TestType.FUNCTIONAL,
                category="HVAC",
                instructions="1. Compare thermostat reading to accurate thermometer\n2. Test heating/cooling response time\n3. Check programming functions",
                required_tools=["calibrated thermometer"],
                expected_result="±2°F accuracy, <5 minute response time"
            )
        ],
        "Ventilation": [
            InspectionTest(
                id="exhaust_fan_performance",
                name="Exhaust Fan Performance",
                description="Test bathroom and kitchen exhaust fans",
                test_type=TestType.MEASUREMENT,
                category="HVAC",
                instructions="1. Turn on exhaust fan\n2. Hold tissue paper near fan\n3. Measure air flow if possible\n4. Check for proper exterior venting",
                required_tools=["tissue paper", "anemometer (optional)"],
                expected_result="Strong suction, proper exterior discharge"
            )
        ],
        "Ductwork": [
            InspectionTest(
                id="duct_leakage_test",
                name="Ductwork Leakage Assessment",
                description="Check for air leaks in accessible ductwork",
                test_type=TestType.DIAGNOSTIC,
                category="HVAC",
                instructions="1. Inspect visible ductwork for gaps\n2. Feel for air leaks around connections\n3. Check duct insulation condition",
                safety_notes="Use flashlight in crawl spaces. Watch for sharp edges.",
                expected_result="No significant air leaks, intact insulation"
            )
        ]
    }
)

# Electrical System Inspection Checklist
ELECTRICAL_CHECKLIST = InspectionChecklist(
    id="electrical_comprehensive",
    name="Electrical System Safety Inspection",
    description="Comprehensive electrical safety and functionality testing",
    property_types=["single_family", "condo", "townhouse"],
    applicable_years={"min": 1950, "max": 2024},
    estimated_time=60,
    required_certifications=["electrical_safety"],
    categories={
        "Main Panel": [
            InspectionTest(
                id="panel_voltage_test",
                name="Main Panel Voltage Test",
                description="Verify proper voltage at main panel",
                test_type=TestType.MEASUREMENT,
                category="Electrical",
                instructions="1. Use multimeter to test voltage\n2. Check 120V and 240V circuits\n3. Verify proper grounding",
                safety_notes="DANGER: Only qualified electricians should open panel. Use proper PPE.",
                required_tools=["multimeter", "non-contact voltage tester"],
                expected_result="120V ±5% for standard circuits, 240V ±5% for high-voltage",
                acceptable_range={"min": 114.0, "max": 126.0},
                measurement_unit=MeasurementUnit.VOLTS
            ),
            InspectionTest(
                id="breaker_functionality",
                name="Circuit Breaker Functionality",
                description="Test circuit breaker operation and labeling",
                test_type=TestType.FUNCTIONAL,
                category="Electrical",
                instructions="1. Verify all breakers are properly labeled\n2. Test GFCI breakers if present\n3. Check for warm breakers (sign of overload)",
                safety_notes="Do not test main breaker. Only test individual circuit breakers.",
                expected_result="All breakers labeled, GFCI breakers test properly"
            )
        ],
        "Outlets and Switches": [
            InspectionTest(
                id="gfci_outlet_test",
                name="GFCI Outlet Testing",
                description="Test all GFCI outlets for proper operation",
                test_type=TestType.FUNCTIONAL,
                category="Electrical",
                instructions="1. Press TEST button - outlet should turn off\n2. Press RESET button - outlet should turn on\n3. Use outlet tester for wiring verification",
                required_tools=["outlet tester", "GFCI tester"],
                expected_result="All GFCI outlets test and reset properly"
            ),
            InspectionTest(
                id="outlet_voltage_test",
                name="Outlet Voltage and Wiring Test",
                description="Test voltage and proper wiring at outlets",
                test_type=TestType.MEASUREMENT,
                category="Electrical",
                instructions="1. Test voltage at multiple outlets\n2. Use 3-prong tester to check wiring\n3. Verify proper grounding",
                required_tools=["multimeter", "3-prong outlet tester"],
                expected_result="120V ±5%, proper hot/neutral/ground wiring",
                acceptable_range={"min": 114.0, "max": 126.0},
                measurement_unit=MeasurementUnit.VOLTS
            )
        ],
        "Grounding System": [
            InspectionTest(
                id="grounding_continuity",
                name="Grounding System Continuity",
                description="Verify electrical grounding system integrity",
                test_type=TestType.MEASUREMENT,
                category="Electrical",
                instructions="1. Test continuity from panel ground to water pipe\n2. Check ground rod connection\n3. Verify equipment grounding",
                required_tools=["multimeter", "continuity tester"],
                safety_notes="Turn off main breaker before testing grounding connections",
                expected_result="Continuous ground path, <25 ohms resistance"
            )
        ]
    }
)

# Plumbing System Inspection Checklist
PLUMBING_CHECKLIST = InspectionChecklist(
    id="plumbing_comprehensive",
    name="Plumbing System Performance Inspection",
    description="Water pressure, flow, and system integrity testing",
    property_types=["single_family", "condo", "townhouse"],
    estimated_time=40,
    categories={
        "Water Pressure": [
            InspectionTest(
                id="static_water_pressure",
                name="Static Water Pressure Test",
                description="Measure water pressure at multiple fixtures",
                test_type=TestType.MEASUREMENT,
                category="Plumbing",
                instructions="1. Attach pressure gauge to hose bib or laundry connection\n2. Turn off all water fixtures\n3. Read static pressure\n4. Test at multiple locations",
                required_tools=["water pressure gauge"],
                expected_result="40-80 PSI (optimal 50-60 PSI)",
                acceptable_range={"min": 40.0, "max": 80.0},
                measurement_unit=MeasurementUnit.PSI
            ),
            InspectionTest(
                id="flow_rate_test",
                name="Water Flow Rate Test",
                description="Measure flow rate at fixtures",
                test_type=TestType.MEASUREMENT,
                category="Plumbing",
                instructions="1. Turn on fixture at full flow\n2. Time how long to fill 1-gallon container\n3. Calculate GPM (60/seconds = GPM)\n4. Test kitchen sink, bathroom sink, shower",
                required_tools=["1-gallon container", "stopwatch"],
                expected_result="Kitchen sink: 2.2 GPM, Bathroom sink: 1.5 GPM, Shower: 2.5 GPM"
            )
        ],
        "Drainage": [
            InspectionTest(
                id="drain_flow_test",
                name="Drain Flow Performance",
                description="Test drainage speed and capacity",
                test_type=TestType.FUNCTIONAL,
                category="Plumbing",
                instructions="1. Fill sink with water\n2. Remove stopper and time drainage\n3. Check for slow drainage or backups\n4. Test all sinks, tubs, showers",
                expected_result="Sink drains in <2 minutes, no standing water"
            ),
            InspectionTest(
                id="toilet_flush_test",
                name="Toilet Flush Performance",
                description="Test toilet flush power and refill",
                test_type=TestType.FUNCTIONAL,
                category="Plumbing",
                instructions="1. Flush toilet and observe water removal\n2. Time refill cycle\n3. Check for proper water level\n4. Test flush handle operation",
                expected_result="Complete bowl evacuation, refill in <3 minutes"
            )
        ],
        "Hot Water": [
            InspectionTest(
                id="hot_water_temperature",
                name="Hot Water Temperature Test",
                description="Measure hot water temperature and recovery time",
                test_type=TestType.MEASUREMENT,
                category="Plumbing",
                instructions="1. Run hot water until maximum temperature\n2. Measure temperature with thermometer\n3. Time how long to reach max temp\n4. Check temperature consistency",
                required_tools=["water thermometer"],
                expected_result="120-140°F (120°F recommended for safety)",
                acceptable_range={"min": 120.0, "max": 140.0},
                measurement_unit=MeasurementUnit.FAHRENHEIT
            )
        ]
    }
)

# Safety Systems Checklist
SAFETY_CHECKLIST = InspectionChecklist(
    id="safety_systems",
    name="Safety Systems Inspection",
    description="Smoke detectors, carbon monoxide, and safety equipment testing",
    property_types=["single_family", "condo", "townhouse", "commercial"],
    estimated_time=20,
    categories={
        "Smoke Detection": [
            InspectionTest(
                id="smoke_detector_test",
                name="Smoke Detector Functionality",
                description="Test all smoke detectors in property",
                test_type=TestType.FUNCTIONAL,
                category="Safety",
                instructions="1. Press test button on each detector\n2. Verify loud alarm sound\n3. Check battery level indicators\n4. Test interconnected alarms if present",
                expected_result="All detectors sound alarm when tested"
            )
        ],
        "Carbon Monoxide": [
            InspectionTest(
                id="co_detector_test",
                name="Carbon Monoxide Detector Test",
                description="Test CO detectors and check for CO presence",
                test_type=TestType.SAFETY,
                category="Safety",
                instructions="1. Press test button on CO detectors\n2. Use CO detector to check near gas appliances\n3. Verify proper placement (not in kitchen/bathroom)",
                required_tools=["portable CO detector"],
                expected_result="All CO detectors functional, no CO detected"
            )
        ]
    }
)

# Compile all checklists
ALL_CHECKLISTS = {
    "hvac": HVAC_CHECKLIST,
    "electrical": ELECTRICAL_CHECKLIST,
    "plumbing": PLUMBING_CHECKLIST,
    "safety": SAFETY_CHECKLIST
}

def get_checklist_for_property(property_type: str, year_built: int, climate_zone: str = "temperate") -> list:
    """Get appropriate checklists for a specific property."""
    applicable_checklists = []
    
    for checklist_id, checklist in ALL_CHECKLISTS.items():
        # Check property type compatibility
        if property_type in checklist.property_types or "all" in checklist.property_types:
            # Check year compatibility
            if checklist.applicable_years:
                min_year = checklist.applicable_years.get("min", 0)
                max_year = checklist.applicable_years.get("max", 9999)
                if min_year <= year_built <= max_year:
                    applicable_checklists.append(checklist)
            else:
                applicable_checklists.append(checklist)
    
    return applicable_checklists

def get_tests_by_category(checklist_id: str) -> dict:
    """Get all tests organized by category for a checklist."""
    if checklist_id not in ALL_CHECKLISTS:
        return {}
    
    return ALL_CHECKLISTS[checklist_id].categories