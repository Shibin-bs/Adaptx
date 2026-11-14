"""Counterfactual Simulation & Reverse Engineering Router"""
from fastapi import APIRouter
from ..models.schemas import CounterfactualRequest, CounterfactualResponse
from ..services.counterfactual_service import simulate_countermeasures

router = APIRouter(prefix="/simulation", tags=["Counterfactual Simulation"])

@router.post("/counterfactual", response_model=CounterfactualResponse)
async def run_counterfactual_simulation(request: CounterfactualRequest):
    """Simulate physiological reverse engineering outcomes under custom astronaut countermeasure regimens."""
    result = simulate_countermeasures(
        exercise_adherence=request.exercise_adherence,
        dietary_countermeasure=request.dietary_countermeasure,
        fluid_loading_pre_landing=request.fluid_loading_pre_landing,
        radiation_shielding_factor=request.radiation_shielding_factor
    )
    return result
