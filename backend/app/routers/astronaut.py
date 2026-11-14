"""Astronaut Profile & Qualifications Router"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from ..models.database import get_db, Astronaut
from ..models.schemas import AstronautProfileResponse

router = APIRouter(prefix="/astronaut", tags=["Astronaut Profile"])

@router.get("/profile", response_model=AstronautProfileResponse)
async def get_astronaut_profile(db: Session = Depends(get_db)):
    """Return astronaut profile and operational flight metadata."""
    astro = db.query(Astronaut).filter(Astronaut.id == "ast-001").first()
    if not astro:
        return {
            "id": "ast-001",
            "name": "Dr. Sarah Chen",
            "rank": "Mission Commander",
            "mission": "ARTEMIS-VII",
            "expedition": "Expedition 74",
            "mission_day": 142,
            "mission_duration_planned": 180,
            "location": "ISS — Low Earth Orbit",
            "altitude_km": 408.0,
            "overall_health_status": "NOMINAL",
            "health_score": 87,
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }
    return {
        "id": astro.id,
        "name": astro.name,
        "rank": astro.rank,
        "mission": astro.mission,
        "expedition": astro.expedition,
        "mission_day": astro.mission_day,
        "mission_duration_planned": astro.mission_duration_planned,
        "location": astro.location,
        "altitude_km": astro.altitude_km,
        "overall_health_status": astro.overall_health_status,
        "health_score": astro.health_score,
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }

@router.get("/qualifications")
async def get_astronaut_qualifications():
    """Return crew member EVA certifications and physiological baselines."""
    return {
        "astronaut_id": "ast-001",
        "name": "Dr. Sarah Chen",
        "certifications": [
            {"badge": "EMU EVA Level III", "status": "ACTIVE_QUALIFIED", "hours_logged": 38.5},
            {"badge": "Robotics Canadarm2 Master", "status": "CERTIFIED", "operations": 14},
            {"badge": "Medical Officer (CMO)", "status": "CERTIFIED", "specialty": "Trauma & Aerospace Medicine"},
            {"badge": "ARED High-Resistance Lead", "status": "COMPLIANT", "compliance_rate": "98.4%"},
        ],
        "earth_baselines": {
            "vo2_max": "46.2 mL/kg/min",
            "resting_heart_rate": "58 bpm",
            "bone_mineral_density_t_score": "+1.2 (Lumbar Spine)",
            "retinal_nerve_fiber_layer": "98 μm (Nominal)",
            "plasma_volume": "2.85 L",
        }
    }
