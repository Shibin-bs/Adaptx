"""ADAPT-X Pydantic Schemas for API Serialization"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AstronautBase(BaseModel):
    id: str
    name: str
    rank: str
    mission: str
    expedition: str
    mission_day: int
    mission_duration_planned: int
    location: str
    altitude_km: float
    overall_health_status: str
    health_score: int

class AstronautProfileResponse(AstronautBase):
    last_updated: str

class MetricValue(BaseModel):
    value: float
    baseline: float
    unit: str
    status: str
    predicted_next: float
    trend: str

class BloodPressureValue(BaseModel):
    systolic: float
    diastolic: float
    baseline_systolic: float
    baseline_diastolic: float
    unit: str
    status: str

class CurrentMetricsResponse(BaseModel):
    data_type: str = "SYNTHETIC_DEMONSTRATION"
    disclaimer: str
    timestamp: str
    metrics: Dict[str, Any]

class TimeSeriesPoint(BaseModel):
    timestamp: str
    value: float
    data_type: str = "SYNTHETIC"

class MetricHistoryResponse(BaseModel):
    metric: str
    data_type: str = "SYNTHETIC_DEMONSTRATION"
    disclaimer: str
    points: List[TimeSeriesPoint]

class AdaptationDimension(BaseModel):
    score: float
    status: str
    trend: str
    description: str

class AdaptationIndexResponse(BaseModel):
    data_type: str = "SYNTHETIC_DEMONSTRATION"
    mission_day: int
    dimensions: Dict[str, AdaptationDimension]
    overall_index: float
    classification: str
    note: str

class EnvironmentalParameter(BaseModel):
    parameter: str
    earth_value: str
    space_value: str
    unit: str
    deviation: str

class EnvironmentalResponse(BaseModel):
    data_type: str = "SYNTHETIC_DEMONSTRATION"
    timestamp: str
    parameters: List[EnvironmentalParameter]

class TrajectoryPoint(BaseModel):
    date: str
    value: float
    lower_ci: float
    upper_ci: float
    data_type: str = "MODEL_PROJECTION"

class PredictionsResponse(BaseModel):
    data_type: str = "MODEL_PROJECTION"
    disclaimer: str
    model: str
    projections: Dict[str, List[TrajectoryPoint]]

class CounterfactualRequest(BaseModel):
    exercise_adherence: float = Field(..., ge=0, le=100, description="ARED + T2 exercise protocol compliance (%)")
    dietary_countermeasure: bool = Field(True, description="Strict caloric and micronutrient adherence")
    fluid_loading_pre_landing: bool = Field(True, description="1.0L isotonic saline reconditioning protocol")
    radiation_shielding_factor: float = Field(1.0, ge=0.5, le=2.0, description="Storm shelter shielding multiplier")

class CounterfactualResponse(BaseModel):
    exercise_adherence: float
    simulated_vo2_max: float
    simulated_bone_density_rate: float
    orthostatic_intolerance_risk: str
    muscle_atrophy_rate: float
    radiation_cumulative_msv: float
    recommendation: str
    classification: str

class DatasetMetadata(BaseModel):
    id: str
    name: str
    source: str
    url: Optional[str]
    variables: List[str]
    subjects: Any
    status: str
    loaded: bool
    note: str

class DatasetRegistryResponse(BaseModel):
    registry: List[DatasetMetadata]
