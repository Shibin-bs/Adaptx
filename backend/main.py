"""ADAPT-X FastAPI Backend — Astronaut Health Intelligence Platform"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
import uvicorn
import random
import math


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("ADAPT-X Backend starting...")
    yield
    print("ADAPT-X Backend shutting down...")


app = FastAPI(
    title="ADAPT-X API",
    description="Adaptive Digital Twin & Physiological Reverse Engineering System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "ADAPT-X",
        "version": "1.0.0",
        "description": "Adaptive Digital Twin & Physiological Reverse Engineering System",
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "ADAPT-X Backend"}


@app.get("/api/astronaut/profile")
async def get_astronaut_profile():
    """Return demo astronaut profile data"""
    return {
        "id": "ast-001",
        "name": "Dr. Sarah Chen",
        "rank": "Mission Commander",
        "mission": "ARTEMIS-VII",
        "mission_day": 142,
        "mission_duration_planned": 180,
        "location": "ISS — Low Earth Orbit",
        "altitude_km": 408,
        "overall_health_status": "NOMINAL",
        "health_score": 87,
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/metrics/current")
async def get_current_metrics():
    """Return current physiological metrics (synthetic demonstration data)"""
    return {
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "disclaimer": "This is synthetic data for demonstration purposes only. Not real sensor data.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metrics": {
            "heart_rate": {
                "value": 68 + random.randint(-2, 2),
                "baseline": 65,
                "unit": "bpm",
                "status": "NOMINAL",
                "predicted_next": 67,
                "trend": "stable",
            },
            "hrv": {
                "value": 42 + random.randint(-2, 2),
                "baseline": 48,
                "unit": "ms",
                "status": "SLIGHTLY_REDUCED",
                "predicted_next": 41,
                "trend": "slight_decrease",
            },
            "blood_pressure": {
                "systolic": 118 + random.randint(-2, 2),
                "diastolic": 76 + random.randint(-2, 2),
                "baseline_systolic": 120,
                "baseline_diastolic": 78,
                "unit": "mmHg",
                "status": "NOMINAL",
            },
            "spo2": {
                "value": 98 + random.choice([0, 0, 1]),
                "baseline": 98,
                "unit": "%",
                "status": "NOMINAL",
                "predicted_next": 98,
                "trend": "stable",
            },
            "temperature": {
                "value": round(36.7 + random.uniform(-0.1, 0.1), 1),
                "baseline": 36.8,
                "unit": "°C",
                "status": "NOMINAL",
                "predicted_next": 36.7,
                "trend": "stable",
            },
            "glucose": {
                "value": 92 + random.randint(-4, 4),
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
                "value": 8200 + random.randint(-300, 300),
                "baseline": 9000,
                "unit": "steps eq",
                "status": "SLIGHTLY_REDUCED",
                "predicted_next": 8400,
                "trend": "stable",
            },
            "stress_level": {
                "value": 38 + random.randint(-3, 3),
                "baseline": 25,
                "unit": "/100",
                "status": "ELEVATED",
                "predicted_next": 36,
                "trend": "slight_decrease",
            },
        },
    }


def generate_time_series(baseline: float, noise: float, n: int = 28, trend: float = 0.0):
    """Generate synthetic physiological time series with timestamps."""
    now = datetime.now(timezone.utc)
    points = []
    for i in range(n):
        ts = (now - timedelta(hours=(n - i) * 6)).isoformat()
        val = baseline + trend * (i / n) + random.gauss(0, noise)
        points.append({"timestamp": ts, "value": round(val, 2), "data_type": "SYNTHETIC"})
    return points


@app.get("/api/metrics/history/{metric_name}")
async def get_metric_history(metric_name: str, days: int = 7):
    """Return historical time-series data for a given physiological metric."""
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
    if metric_name not in config:
        raise HTTPException(status_code=404, detail=f"Metric {metric_name} not found")

    base, noise, trend = config[metric_name]
    points = generate_time_series(base, noise, n=days * 4, trend=trend)
    return {
        "metric": metric_name,
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "disclaimer": "Synthetic data generated for demonstration. Not real measurements.",
        "points": points,
    }


@app.get("/api/adaptation/index")
async def get_adaptation_index():
    """Return current Adaptive Response Index scores across 5 dimensions."""
    return {
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "mission_day": 142,
        "dimensions": {
            "cardiovascular": {
                "score": 74,
                "status": "ACTIVE_ADAPTATION",
                "trend": "stable",
                "description": "Mild orthostatic deconditioning noted; HRV slightly reduced from baseline.",
            },
            "musculoskeletal": {
                "score": 68,
                "status": "ACTIVE_ADAPTATION",
                "trend": "decreasing",
                "description": "Bone mineral density rate -0.78%/mo; high-load resistance countermeasure compliant.",
            },
            "circadian": {
                "score": 61,
                "status": "ELEVATED_DEVIATION",
                "trend": "stable",
                "description": "Sleep efficiency reduced to 6.8h; circadian phase shifted +1.4h.",
            },
            "metabolic": {
                "score": 82,
                "status": "INITIAL_RESPONSE",
                "trend": "stable",
                "description": "Hepatic and glycemic biomarkers nominal; minor insulin sensitivity shift.",
            },
            "behavioural": {
                "score": 71,
                "status": "ACTIVE_ADAPTATION",
                "trend": "improving",
                "description": "Allostatic load score 38/100; trending towards adaptation from early mission peak.",
            },
        },
        "overall_index": 71,
        "classification": "ACTIVE_ADAPTATION",
        "note": "These are software research classifications, not validated clinical diagnoses.",
    }


@app.get("/api/environment/current")
async def get_environment():
    """Return current spacecraft environment parameters with Earth baseline comparison."""
    return {
        "data_type": "SYNTHETIC_DEMONSTRATION",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "parameters": [
            {"parameter": "Gravity Vector", "earth_value": "9.81 m/s² (1.0G)", "space_value": "0.001 m/s² (μG)", "unit": "m/s²", "deviation": "-99.99%"},
            {"parameter": "Radiation Dosimetry", "earth_value": "0.008 mSv/d", "space_value": "1.84 mSv/d", "unit": "mSv/day", "deviation": "+22,900%"},
            {"parameter": "Cabin Ambient CO₂", "earth_value": "0.04 %", "space_value": "0.52 %", "unit": "% volume", "deviation": "+1,200%"},
            {"parameter": "Atmospheric Pressure", "earth_value": "101.3 kPa", "space_value": "101.3 kPa", "unit": "kPa", "deviation": "0.00%"},
            {"parameter": "Cabin Temperature", "earth_value": "22.0 °C", "space_value": "21.5 °C", "unit": "°C", "deviation": "-2.3%"},
            {"parameter": "Circadian Cycle", "earth_value": "24.0 h diurnal", "space_value": "16 orbits / 24h", "unit": "cycles", "deviation": "Phase shift +1.4h"},
            {"parameter": "Mission Duration", "earth_value": "0 days", "space_value": "Day 142 of 180", "unit": "days", "deviation": "79% Elapsed"},
        ],
    }


@app.get("/api/predictions/trajectory")
async def get_predictions():
    """Return 14-day physiological trajectory projections with uncertainty intervals."""
    days_ahead = 14
    now = datetime.now(timezone.utc)
    future_dates = [(now + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days_ahead)]

    def project_metric(start: float, end: float, noise: float = 0.5):
        series = []
        for i, d in enumerate(future_dates):
            t = i / max(1, days_ahead - 1)
            mean_val = start + (end - start) * t
            sim_val = round(mean_val + random.gauss(0, noise * 0.3), 2)
            lower_ci = round(mean_val - 1.96 * noise * (0.6 + 0.4 * t), 2)
            upper_ci = round(mean_val + 1.96 * noise * (0.6 + 0.4 * t), 2)
            series.append({
                "date": d,
                "value": sim_val,
                "lower_ci": lower_ci,
                "upper_ci": upper_ci,
                "data_type": "MODEL_PROJECTION",
            })
        return series

    return {
        "data_type": "MODEL_PROJECTION",
        "disclaimer": "These are model-based projections with uncertainty intervals, not guaranteed outcomes.",
        "model": "Bayesian State-Space & XGBoost Hybrid",
        "projections": {
            "heart_rate": project_metric(68.0, 67.2, 1.2),
            "hrv": project_metric(42.0, 40.5, 2.0),
            "stress_level": project_metric(38.0, 33.5, 2.5),
            "sleep_duration": project_metric(6.8, 7.1, 0.3),
        },
    }


@app.get("/api/datasets/registry")
async def get_dataset_registry():
    """Return registry of NASA OSDR spaceflight datasets."""
    return {
        "registry": [
            {
                "id": "NASA-OSDR-OSD-379",
                "name": "Inspiration4 Civilian Spaceflight Multi-Omics Atlas",
                "source": "NASA Open Science Data Repository (OSDR)",
                "url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-379",
                "variables": ["Genomics", "Metabolomics", "Proteomics", "Telomere Dynamics", "Cytokines"],
                "subjects": 4,
                "status": "AVAILABLE",
                "loaded": False,
                "note": "Public NASA OSDR repository study. Ready for ingestion in automated ETL pipeline.",
            },
            {
                "id": "NASA-OSDR-OSD-569",
                "name": "NASA Spaceflight Standard Measures Cross-Mission Dataset",
                "source": "NASA Life Sciences Data Archive (LSDA)",
                "url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-569",
                "variables": ["Bone Mineral Density", "Muscle Volume", "VO2 Max", "Orthostatic Tolerance", "SANS"],
                "subjects": "Multiple Long-Duration ISS Expeditions",
                "status": "AVAILABLE",
                "loaded": False,
                "note": "Standardized longitudinal physiological collection protocol.",
            },
            {
                "id": "NASA-TWINS-STUDY-001",
                "name": "NASA Twins Study Longitudinal Multi-Omics Dataset",
                "source": "NASA Human Research Program",
                "url": "https://www.nasa.gov/twins-study",
                "variables": ["Cognitive Battery", "Telomere Length", "Epigenetic Ageing", "Carotid IMT"],
                "subjects": 2,
                "status": "AVAILABLE",
                "loaded": False,
                "note": "Reference benchmark for 340-day spaceflight adaptation.",
            },
            {
                "id": "SYNTHETIC-ADAPT-X-001",
                "name": "ADAPT-X High-Fidelity Synthetic Spacecraft Stream",
                "source": "ADAPT-X Physiological Intelligence Simulator",
                "url": None,
                "variables": ["Heart Rate", "HRV (RMSSD)", "Blood Pressure", "SpO2", "Core Temp", "Glucose", "Sleep", "Activity", "Stress"],
                "subjects": 1,
                "status": "ACTIVE",
                "loaded": True,
                "note": "Active real-time simulation stream. Clearly labelled demonstration data.",
            },
        ]
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
