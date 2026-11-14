"""Physiological Biometric Telemetry Router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models.database import get_db
from ..models.schemas import CurrentMetricsResponse, MetricHistoryResponse
from ..services.telemetry_service import get_live_metrics_snapshot, get_historical_metric

router = APIRouter(prefix="/metrics", tags=["Physiological Metrics"])

@router.get("/current", response_model=CurrentMetricsResponse)
async def get_current_metrics(db: Session = Depends(get_db)):
    """Return live biometric telemetry for all 9 physiological sensors."""
    return get_live_metrics_snapshot(db)

@router.get("/history/{metric_name}", response_model=MetricHistoryResponse)
async def get_metric_history(metric_name: str, days: int = 7, db: Session = Depends(get_db)):
    """Return historical time-series data for a specific physiological signal."""
    valid_metrics = [
        "heart_rate", "hrv", "hrv_rmssd", "spo2", "temperature",
        "core_temperature", "glucose", "stress_level", "stress_score",
        "sleep_duration", "activity_level", "activity_steps"
    ]
    if metric_name not in valid_metrics:
        raise HTTPException(status_code=404, detail=f"Metric '{metric_name}' not found. Supported: {valid_metrics}")
        
    points = get_historical_metric(db, metric_name, days=days)
    return {
        "metric": metric_name,
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "disclaimer": "Synthetic biometric data generated for spaceflight demonstration purposes. Not real hardware sensor readings.",
        "points": points
    }

@router.get("/thresholds")
async def get_alarm_thresholds():
    """Return NASA Flight Rule medical alert boundaries and warning triggers."""
    return {
        "thresholds": {
            "heart_rate": {"unit": "bpm", "critical_low": 45, "warning_low": 50, "nominal_min": 55, "nominal_max": 95, "warning_high": 110, "critical_high": 130},
            "hrv": {"unit": "ms", "critical_low": 18, "warning_low": 28, "nominal_min": 40, "nominal_max": 85, "warning_high": 110, "critical_high": 130},
            "blood_pressure_systolic": {"unit": "mmHg", "critical_low": 85, "warning_low": 95, "nominal_min": 105, "nominal_max": 130, "warning_high": 140, "critical_high": 160},
            "spo2": {"unit": "%", "critical_low": 90.0, "warning_low": 94.0, "nominal_min": 96.0, "nominal_max": 100.0, "warning_high": None, "critical_high": None},
            "core_temperature": {"unit": "°C", "critical_low": 35.0, "warning_low": 35.8, "nominal_min": 36.4, "nominal_max": 37.3, "warning_high": 37.8, "critical_high": 38.5},
            "glucose": {"unit": "mg/dL", "critical_low": 60, "warning_low": 70, "nominal_min": 75, "nominal_max": 115, "warning_high": 130, "critical_high": 160},
            "stress_score": {"unit": "/100", "critical_low": None, "warning_low": None, "nominal_min": 0, "nominal_max": 45, "warning_high": 65, "critical_high": 85},
        }
    }
