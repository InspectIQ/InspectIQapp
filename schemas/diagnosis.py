from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from .common import Photo, ProcessedPhoto, PropertyContext, Property


class DiagnosisInput(BaseModel):
    diagnosis_id: Optional[str] = None
    photos: List[Photo]
    user_description: Optional[str] = None
    property_context: Optional[PropertyContext] = None
    property: Optional[Property] = None


class DiagnosisIssue(BaseModel):
    issue_label: str
    system: Literal[
        "plumbing", "roof", "hvac", "electrical",
        "structure", "appliance", "other"
    ]
    urgency: Literal["low", "medium", "high", "critical"]
    probable_cause: str
    confidence: float = Field(ge=0.0, le=1.0)


class DiagnosisIssueEnriched(BaseModel):
    issue_label: str
    system: str
    urgency: str
    probable_cause: str
    diy_possible: bool
    recommended_trade: str
    cost_low: float
    cost_high: float
    time_hours: float
    materials_list: List[str] = Field(default_factory=list)
    safety_warnings: Optional[str] = None
    steps: List[str]


class DiagnosisSummary(BaseModel):
    overall_urgency: str
    summary_cost_low: float
    summary_cost_high: float


class DiagnosisReportSummary(BaseModel):
    headline: str
    recommended_next_step: str


class DiagnosisReport(BaseModel):
    diagnosis_id: Optional[str] = None
    report_markdown: str
    report_summary_json: DiagnosisReportSummary
