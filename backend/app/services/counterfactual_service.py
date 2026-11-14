"""ADAPT-X Counterfactual Simulation Engine
Reverse-engineers astronaut physiological trajectories under simulated countermeasure interventions:
- ARED high-load resistive exercise
- T2 treadmill aerobic protocol
- Fluid loading & lower body negative pressure (LBNP)
- Radiation storm shelter shielding factor
"""
import numpy as np

def simulate_countermeasures(
    exercise_adherence: float,
    dietary_countermeasure: bool = True,
    fluid_loading_pre_landing: bool = True,
    radiation_shielding_factor: float = 1.0,
    mission_day: int = 142
) -> dict:
    # 1. VO2 Max Preservation (%)
    # Non-linear relationship: dropping below 70% accelerates cardiorespiratory deconditioning
    adherence_ratio = exercise_adherence / 100.0
    if adherence_ratio >= 0.85:
        vo2_max = 100.0 - (1.0 - adherence_ratio) * 15.0
    else:
        vo2_max = 85.0 - (0.85 - adherence_ratio) * 45.0
    vo2_max = np.clip(vo2_max, 50.0, 100.0)
    
    # 2. Monthly Femur Bone Mineral Density Loss Rate (%/mo)
    # Target in space with ARED: -0.7% to -0.8%/mo. Without ARED: -1.5% to -2.0%/mo
    bmd_rate = -0.78 - (1.0 - adherence_ratio) * 1.2
    if not dietary_countermeasure:
        bmd_rate -= 0.15 # Calcium/Vitamin D deficiency accelerates resorption
    bmd_rate = np.clip(bmd_rate, -2.5, -0.6)
    
    # 3. Orthostatic Intolerance Risk upon Planetary Re-entry
    risk_score = (1.0 - adherence_ratio) * 0.6
    if not fluid_loading_pre_landing:
        risk_score += 0.3
    if not dietary_countermeasure:
        risk_score += 0.1
        
    if risk_score > 0.5:
        ortho_risk = "HIGH"
    elif risk_score > 0.25:
        ortho_risk = "MODERATE"
    else:
        ortho_risk = "LOW"
        
    # 4. Muscular Atrophy Rate (%/mo)
    muscle_atrophy = -0.9 - (1.0 - adherence_ratio) * 3.5
    if not dietary_countermeasure:
        muscle_atrophy -= 0.8 # Insufficient protein
    muscle_atrophy = np.clip(muscle_atrophy, -6.0, -0.8)
    
    # 5. Cumulative Radiation Dose (mSv) over 180 days
    base_daily_mSv = 1.84 / radiation_shielding_factor
    cumulative_dose = round(base_daily_mSv * 180.0, 1)
    
    # Recommendation text
    if exercise_adherence < 70:
        recommendation = "CRITICAL: Schedule urgent countermeasure intervention. Increase daily ARED resistive squats and T2 loading."
        classification = "ELEVATED_DEVIATION"
    elif exercise_adherence < 90:
        recommendation = "ADVISORY: Maintain current countermeasure regimen; optimize post-exercise protein synthesis."
        classification = "ACTIVE_ADAPTATION"
    else:
        recommendation = "OPTIMAL: Countermeasure adherence matches NASA flight rule standards. Re-entry readiness predicted high."
        classification = "NOMINAL_BASELINE"
        
    return {
        "exercise_adherence": round(exercise_adherence, 1),
        "simulated_vo2_max": round(float(vo2_max), 1),
        "simulated_bone_density_rate": round(float(bmd_rate), 2),
        "orthostatic_intolerance_risk": ortho_risk,
        "muscle_atrophy_rate": round(float(muscle_atrophy), 2),
        "radiation_cumulative_msv": cumulative_dose,
        "recommendation": recommendation,
        "classification": classification
    }
