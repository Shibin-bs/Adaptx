"""Spacecraft Environment & ECLSS Monitoring Router"""
from fastapi import APIRouter
from datetime import datetime, timezone
from ..models.schemas import EnvironmentalResponse

router = APIRouter(prefix="/environment", tags=["Environmental Analysis"])

@router.get("/current", response_model=EnvironmentalResponse)
async def get_environment():
    """Return spacecraft environmental life support parameters and Earth comparisons."""
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

@router.get("/eclss")
async def get_eclss_subsystems():
    """Return life support engineering subsystem states and consumables reserves."""
    return {
        "eclss_status": "ALL_NOMINAL",
        "consumables": {
            "potable_water_liters": {"current": 420.0, "capacity": 550.0, "reserve_days": 168},
            "oxygen_kg": {"current": 84.5, "capacity": 110.0, "reserve_days": 182},
            "nitrogen_kg": {"current": 210.0, "capacity": 250.0, "reserve_days": 240},
            "co2_scrubber_efficiency": "98.8% (Amine Swing Bed A)",
            "water_recovery_efficiency": "93.4% (Urine Processor Assembly Nominal)",
        },
        "spacecraft_dynamics": {
            "orbital_velocity_kms": 7.66,
            "orbital_period_minutes": 92.68,
            "apogee_km": 418.2,
            "perigee_km": 408.0,
            "solar_beta_angle": "+28.4°",
        }
    }
