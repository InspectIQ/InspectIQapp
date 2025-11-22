from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from .common import Photo, ProcessedPhoto, PropertyContext, Property


class InspectionInput(BaseModel):
    inspection_id: Optional[str] = None
    photos: List[Photo]
    property_context: Optional[PropertyContext] = None
    property: Optional[Property] = None


class BoundingBox(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    w: Optional[float] = None
    h: Optional[float] = None


class InspectionIssue(BaseModel):
    image_url: str
    room_name: Optional[str] = None
    issue_type: Literal[
        "scratch", "stain", "crack", "dent", "hole",
        "water_damage", "mold_signs", "broken_fixture",
        "flooring_damage", "other"
    ]
    description: str
    severity: Literal["low", "medium", "high", "critical"]
    confidence: float = Field(ge=0.0, le=1.0)
    bounding_box: Optional[BoundingBox] = None


class InspectionIssueEnriched(BaseModel):
    image_url: str
    room_name: Optional[str] = None
    issue_type: str
    description: str
    severity: str
    recommended_action: str
    recommended_trade: str
    diy_possible: bool
    cost_low: float
    cost_high: float
    time_hours: float
    materials_list: List[str] = Field(default_factory=list)
    safety_warnings: Optional[str] = None


class InspectionSummary(BaseModel):
    issue_count: int
    summary_severity: str
    summary_cost_low: float
    summary_cost_high: float


class InspectionReportSummary(BaseModel):
    headline: str
    recommendations: List[str]


class InspectionReport(BaseModel):
    inspection_id: Optional[str] = None
    report_markdown: str
    report_summary_json: InspectionReportSummary
