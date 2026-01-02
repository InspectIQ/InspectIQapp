from sqlalchemy import Column, Integer, String, DateTime, Date, Float, Boolean, ForeignKey, JSON, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()


class UserRole(str, enum.Enum):
    OWNER = "owner"
    TENANT = "tenant"
    MANAGER = "manager"
    REALTOR = "realtor"
    ADMIN = "admin"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class InspectionType(str, enum.Enum):
    MOVE_IN = "move_in"
    MOVE_OUT = "move_out"
    ROUTINE = "routine"
    PRE_SALE = "pre_sale"
    POST_RENOVATION = "post_renovation"
    COMPREHENSIVE = "comprehensive"  # New: includes testing protocols


class TestType(str, enum.Enum):
    VISUAL = "visual"
    MEASUREMENT = "measurement"
    FUNCTIONAL = "functional"
    SAFETY = "safety"
    DIAGNOSTIC = "diagnostic"


class TestResult(str, enum.Enum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_TESTED = "not_tested"
    NOT_APPLICABLE = "not_applicable"


class MeasurementUnit(str, enum.Enum):
    PSI = "psi"
    VOLTS = "volts"
    AMPS = "amps"
    FAHRENHEIT = "fahrenheit"
    CELSIUS = "celsius"
    PERCENT = "percent"
    DECIBELS = "decibels"
    PPM = "ppm"
    CFM = "cfm"
    GPM = "gpm"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.OWNER)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    is_active = Column(Boolean, default=True)
    reset_token_hash = Column(String, nullable=True, default=None)
    reset_token_expires = Column(DateTime, nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    properties = relationship("Property", back_populates="owner")
    inspections = relationship("Inspection", back_populates="inspector")
    team_memberships = relationship("TeamMember", back_populates="user")


class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Address
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, default="USA")
    
    # Property details
    unit_number = Column(String)
    property_type = Column(String)  # apartment, house, condo, etc.
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    square_feet = Column(Float)
    year_built = Column(Integer)
    lot_size = Column(Float)  # in acres
    
    # Legacy field for backward compatibility
    num_rooms = Column(Integer)
    
    # Metadata
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="properties")
    inspections = relationship("Inspection", back_populates="property")


class Inspection(Base):
    __tablename__ = "inspections"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    inspector_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Inspection details
    inspection_type = Column(Enum(InspectionType), nullable=False)
    inspection_date = Column(DateTime, default=datetime.utcnow)
    
    # Report data
    report_markdown = Column(Text)
    report_pdf_url = Column(String)
    report_summary = Column(JSON)
    
    # AI analysis results
    issues_detected = Column(JSON)  # Array of detected issues
    summary_stats = Column(JSON)  # issue_count, severity, costs
    
    # Blockchain/verification
    hash_on_chain = Column(String)
    chain_tx_id = Column(String)
    
    # Status
    status = Column(String, default="pending")  # pending, processing, completed, failed
    is_public = Column(Boolean, default=False)
    public_share_token = Column(String, unique=True)
    
    # Metadata
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")
    rooms = relationship("Room", back_populates="inspection", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("inspections.id"), nullable=False)
    
    # Room details
    room_type = Column(String, nullable=False)  # living_room, bedroom, kitchen, etc.
    room_name = Column(String)  # "Master Bedroom", "Kitchen", etc.
    order_index = Column(Integer)
    
    # Photos
    photo_urls = Column(JSON)  # Array of photo URLs
    
    # AI analysis
    issues = Column(JSON)  # Array of detected issues for this room
    
    # Metadata
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    inspection = relationship("Inspection", back_populates="rooms")


class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    
    # Issue details
    issue_type = Column(String, nullable=False)
    category = Column(String)
    description = Column(Text, nullable=False)
    severity = Column(String, nullable=False)  # low, medium, high, critical
    confidence = Column(Float)
    
    # Location
    photo_url = Column(String)
    bounding_box = Column(JSON)  # {x, y, w, h}
    
    # Repair info
    recommended_action = Column(Text)
    recommended_trade = Column(String)
    estimated_cost_low = Column(Float)
    estimated_cost_high = Column(Float)
    estimated_time_hours = Column(Float)
    materials_list = Column(JSON)
    safety_warnings = Column(Text)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)


class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Settings
    max_members = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    members = relationship("TeamMember", back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Permissions
    role = Column(String, default="member")  # admin, member, viewer
    can_create_inspections = Column(Boolean, default=True)
    can_edit_properties = Column(Boolean, default=False)
    can_manage_team = Column(Boolean, default=False)
    
    # Metadata
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Subscription details
    tier = Column(Enum(SubscriptionTier), nullable=False)
    status = Column(String, default="active")  # active, cancelled, expired
    
    # Billing
    stripe_customer_id = Column(String)
    stripe_subscription_id = Column(String)
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    
    # Usage limits
    inspections_used = Column(Integer, default=0)
    inspections_limit = Column(Integer)
    properties_limit = Column(Integer)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Payment details
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    payment_type = Column(String)  # subscription, per_report, upgrade
    
    # Stripe
    stripe_payment_intent_id = Column(String)
    stripe_charge_id = Column(String)
    
    # Status
    status = Column(String, default="pending")  # pending, succeeded, failed
    
    # Metadata
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# Enhanced Inspection Models for Professional Testing

class InspectionChecklist(Base):
    """Professional inspection checklists with testing protocols."""
    __tablename__ = "inspection_checklists"
    
    id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(String, unique=True, nullable=False)  # hvac_comprehensive, electrical_safety
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Applicability
    property_types = Column(JSON)  # ["single_family", "condo"]
    applicable_years = Column(JSON)  # {"min": 1950, "max": 2024}
    climate_zones = Column(JSON)  # ["cold", "temperate", "hot"]
    
    # Metadata
    estimated_time = Column(Integer)  # minutes
    required_certifications = Column(JSON)  # ["electrical_safety"]
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tests = relationship("InspectionTest", back_populates="checklist")


class InspectionTest(Base):
    """Individual tests within inspection checklists."""
    __tablename__ = "inspection_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(Integer, ForeignKey("inspection_checklists.id"), nullable=False)
    
    # Test identification
    test_id = Column(String, nullable=False)  # heat_functionality, gfci_outlet_test
    name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, nullable=False)  # HVAC, Electrical, Plumbing
    
    # Test parameters
    test_type = Column(Enum(TestType), nullable=False)
    instructions = Column(Text, nullable=False)
    safety_notes = Column(Text)
    required_tools = Column(JSON)  # ["multimeter", "thermometer"]
    
    # Expected results
    expected_result = Column(Text)
    acceptable_range = Column(JSON)  # {"min": 114.0, "max": 126.0}
    measurement_unit = Column(Enum(MeasurementUnit))
    
    # Metadata
    order_index = Column(Integer, default=0)
    is_required = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    checklist = relationship("InspectionChecklist", back_populates="tests")
    results = relationship("TestResult", back_populates="test")


class TestResult(Base):
    """Results from performing inspection tests."""
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("inspections.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("inspection_tests.id"), nullable=False)
    
    # Test results
    result = Column(Enum(TestResult), default=TestResult.NOT_TESTED)
    measured_value = Column(Float)
    notes = Column(Text)
    photos = Column(JSON)  # ["photo1.jpg", "photo2.jpg"]
    
    # AI analysis
    ai_analysis = Column(Text)
    risk_level = Column(String)  # low, medium, high, critical
    
    # Metadata
    tested_by = Column(Integer, ForeignKey("users.id"))
    tested_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    inspection = relationship("Inspection")
    test = relationship("InspectionTest", back_populates="results")
    tester = relationship("User")


class SystemDiagnostic(Base):
    """Overall system health diagnostics."""
    __tablename__ = "system_diagnostics"
    
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("inspections.id"), nullable=False)
    
    # System information
    system_name = Column(String, nullable=False)  # HVAC, Electrical, Plumbing
    overall_condition = Column(String)  # excellent, good, fair, poor, critical
    
    # Performance metrics
    efficiency_rating = Column(Float)  # 0.0 - 1.0
    safety_score = Column(Float)  # 0.0 - 1.0
    code_compliance = Column(Boolean)
    
    # Issues and recommendations
    critical_issues = Column(JSON)  # ["Exposed wiring", "Gas leak"]
    warnings = Column(JSON)  # ["Low water pressure", "Dirty filter"]
    recommendations = Column(JSON)  # ["Replace HVAC filter", "Upgrade panel"]
    
    # Cost estimates
    immediate_repairs = Column(Float)
    preventive_maintenance = Column(Float)
    replacement_timeline = Column(String)  # "2-3 years", "immediate"
    
    # AI analysis
    ai_summary = Column(Text)
    confidence_score = Column(Float)  # 0.0 - 1.0
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    inspection = relationship("Inspection")


class MeasurementReading(Base):
    """Individual measurement readings from professional tools."""
    __tablename__ = "measurement_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    test_result_id = Column(Integer, ForeignKey("test_results.id"), nullable=False)
    
    # Measurement details
    measurement_type = Column(String, nullable=False)  # voltage, pressure, temperature
    value = Column(Float, nullable=False)
    unit = Column(Enum(MeasurementUnit), nullable=False)
    location = Column(String)  # "main panel", "kitchen sink", "master bedroom"
    
    # Tool information
    tool_used = Column(String)  # "Fluke 87V Multimeter", "Pressure Gauge"
    calibration_date = Column(Date)
    
    # Context
    conditions = Column(Text)  # "System running for 10 minutes", "All fixtures off"
    notes = Column(Text)
    
    # Metadata
    measured_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    test_result = relationship("TestResult")


class InspectionTemplate(Base):
    """Templates for different inspection types and scenarios."""
    __tablename__ = "inspection_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Applicability
    property_types = Column(JSON)  # ["single_family", "condo"]
    inspection_purposes = Column(JSON)  # ["purchase", "maintenance", "insurance"]
    
    # Template configuration
    visual_inspection = Column(Boolean, default=True)
    system_testing = Column(Boolean, default=True)
    measurements = Column(Boolean, default=True)
    code_compliance = Column(Boolean, default=True)
    
    # Checklists to include
    required_checklists = Column(JSON)  # ["hvac_comprehensive", "electrical_safety"]
    optional_checklists = Column(JSON)  # ["plumbing_performance"]
    
    # Customization
    custom_tests = Column(JSON)  # Additional test definitions
    regional_requirements = Column(JSON)  # State/region specific requirements
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User")
