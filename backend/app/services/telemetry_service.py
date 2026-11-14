"""ADAPT-X Telemetry Service"""
import random
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from ..models.database import BiometricTelemetry, Astronaut

def get_live_metrics_snapshot(db: Session = None):
    """Generate high-fidelity live biometric telemetry snapshot."""
    now = datetime.now(timezone.utc)
    
    # Base live metrics with subtle natural micro-variations
    hr = 68 + random.randint(-2, 2)
    hrv = 42 + random.randint(-2, 2)
    bp_sys = 118 + random.randint(-2, 2)
    bp_dia = 76 + random.randint(-2, 2)
    spo2 = 98.4 + random.choice([-0.2, 0.0, 0.2])
    temp = round(36.7 + random.uniform(-0.1, 0.1), 1)
    glucose = 92 + random.randint(-3, 3)
    stress = 38 + random.randint(-2, 2)
    activity = 8200 + random.randint(-200, 200)
    
    return {
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "disclaimer": "Synthetic biometric data generated for spaceflight demonstration purposes. Not real hardware sensor readings.",
        "timestamp": now.isoformat(),
        "metrics": {
            "heart_rate": {
                "value": hr,
                "baseline": 65,
                "unit": "bpm",
                "status": "NOMINAL",
                "predicted_next": 67,
                "trend": "stable",
            },
            "hrv": {
                "value": hrv,
                "baseline": 48,
                "unit": "ms",
                "status": "SLIGHTLY_REDUCED",
                "predicted_next": 41,
                "trend": "slight_decrease",
            },
            "blood_pressure": {
                "systolic": bp_sys,
                "diastolic": bp_dia,
                "baseline_systolic": 120,
                "baseline_diastolic": 78,
                "unit": "mmHg",
                "status": "NOMINAL",
            },
            "spo2": {
                "value": spo2,
                "baseline": 98.0,
                "unit": "%",
                "status": "NOMINAL",
                "predicted_next": 98.4,
                "trend": "stable",
            },
            "temperature": {
                "value": temp,
                "baseline": 36.8,
                "unit": "°C",
                "status": "NOMINAL",
                "predicted_next": 36.7,
                "trend": "stable",
            },
            "glucose": {
                "value": glucose,
                "baseline": 90,
                "unit": "mg/dL",
                "status": "NOMINAL",
                "predicted_next": 91,
                "trend": "stable",
            },
            "sleep_duration": {
                "value": 6.8,
                "baseline": 7.5,
                "unit": "hours",
                "status": "SLIGHTLY_REDUCED",
                "predicted_next": 7.0,
                "trend": "recovering",
            },
            "activity_level": {
                "value": activity,
                "baseline": 9000,
                "unit": "steps eq",
                "status": "NOMINAL",
                "predicted_next": 8400,
                "trend": "stable",
            },
            "stress_level": {
                "value": stress,
                "baseline": 25,
                "unit": "/100",
                "status": "ELEVATED",
                "predicted_next": 36,
                "trend": "slight_decrease",
            },
        },
    }

def get_historical_metric(db: Session, metric_name: str, days: int = 7):
    """Retrieve historical time-series points from database or generate realistic series."""
    points = []
    now = datetime.now(timezone.utc)
    
    if db:
        # Query recent telemetry from database
        records = db.query(BiometricTelemetry).order_by(BiometricTelemetry.timestamp.desc()).limit(days * 4).all()
        if records:
            for r in reversed(records):
                val = getattr(r, metric_name, None)
                if val is not None:
                    points.append({
                        "timestamp": r.timestamp.isoformat(),
                        "value": round(float(val), 2),
                        "data_type": "SYNTHETIC"
                    })
                    
    if not points:
        # Fallback generator
        config = {
            "heart_rate": (68, 2.5, 0.0),
            "hrv": (44, 3.0, -1.5),
            "spo2": (98, 0.4, 0.0),
            "temperature": (36.7, 0.12, 0.0),
            "glucose": (91, 4.0, 0.0),
            "stress_level": (36, 4.0, -2.0),
            "sleep_duration": (6.9, 0.4, 0.2),
            "activity_level": (8300, 400, 100),
        }
        base, noise, trend = config.get(metric_name, (50, 2.0, 0.0))
        n = days * 4
        for i in range(n):
            ts = (now - timedelta(hours=(n - i) * 6)).isoformat()
            val = base + trend * (i / n) + random.gauss(0, noise)
            points.append({"timestamp": ts, "value": round(val, 2), "data_type": "SYNTHETIC"})
            
    return points
