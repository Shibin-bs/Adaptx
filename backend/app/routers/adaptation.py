"""Adaptive Response Index (ARI) Router"""
from fastapi import APIRouter
from ..models.schemas import AdaptationIndexResponse
from ..services.ml_inference_service import ml_service

router = APIRouter(prefix="/adaptation", tags=["Adaptation Engine"])

@router.get("/index", response_model=AdaptationIndexResponse)
async def get_adaptation_index():
    """Return 5-dimensional Adaptive Response Index (ARI) score with biological phase classification."""
    # Run ML model on nominal baseline telemetry
    scores = ml_service.predict_adaptation({
        'heart_rate': 68.0,
        'hrv_rmssd': 42.0,
        'bp_systolic': 118.0,
        'bp_diastolic': 76.0,
        'spo2': 98.4,
        'core_temperature': 36.7,
        'glucose': 92.0,
        'sleep_duration': 6.8,
        'activity_steps': 8200,
        'stress_score': 38.0,
        'hr_rolling_mean': 68.0,
        'hrv_rolling_mean': 42.0,
        'stress_rolling_mean': 38.0,
        'activity_rolling_mean': 8200,
        'pulse_pressure': 42.0,
        'map': 90.0,
    })
    
    return {
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "mission_day": 142,
        "dimensions": {
            "cardiovascular": {
                "score": scores.get('cardiovascular', 74.0),
                "status": "ACTIVE_ADAPTATION",
                "trend": "stable",
                "description": "Mild orthostatic deconditioning noted; HRV slightly reduced from baseline.",
            },
            "musculoskeletal": {
                "score": scores.get('musculoskeletal', 68.0),
                "status": "ACTIVE_ADAPTATION",
                "trend": "decreasing",
                "description": "Bone mineral density rate -0.78%/mo; high-load resistance countermeasure compliant.",
            },
            "circadian": {
                "score": scores.get('circadian', 61.0),
                "status": "ELEVATED_DEVIATION",
                "trend": "stable",
                "description": "Sleep efficiency reduced to 6.8h; circadian phase shifted +1.4h.",
            },
            "metabolic": {
                "score": scores.get('metabolic', 82.0),
                "status": "INITIAL_RESPONSE",
                "trend": "stable",
                "description": "Hepatic and glycemic biomarkers nominal; minor insulin sensitivity shift.",
            },
            "behavioural": {
                "score": scores.get('behavioural', 71.0),
                "status": "ACTIVE_ADAPTATION",
                "trend": "improving",
                "description": "Allostatic load score 38/100; trending towards adaptation from early mission peak.",
            },
        },
        "overall_index": scores.get('overall_ari', 71.2),
        "classification": "ACTIVE_ADAPTATION",
        "note": "These are software research classifications derived from multi-target XGBoost models, not validated clinical diagnoses.",
    }

@router.post("/evaluate")
async def evaluate_custom_telemetry(vitals: dict):
    """Run real-time XGBoost ML inference on user-supplied physiological vitals."""
    preds = ml_service.predict_adaptation(vitals)
    return {
        "status": "success",
        "model": "XGBoost Adaptive Response Index v1.0",
        "scores": preds,
        "classification": "ACTIVE_ADAPTATION" if preds.get('overall_ari', 70) > 65 else "ELEVATED_DEVIATION"
    }
