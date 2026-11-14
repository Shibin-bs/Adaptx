"""ADAPT-X Synthetic Astronaut Physiological Telemetry Generator
Simulates 180 days of long-duration spaceflight telemetry across 9 physiological subsystems.
Includes microgravity fluid shifts, bone demineralization, circadian shifts, and exercise countermeasures.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone
import json
import os

def generate_mission_dataset(days=180, samples_per_day=4, seed=42):
    np.random.seed(seed)
    total_samples = days * samples_per_day
    start_date = datetime(2026, 6, 25, 0, 0, tzinfo=timezone.utc)
    
    timestamps = [start_date + timedelta(hours=i * (24 / samples_per_day)) for i in range(total_samples)]
    mission_days = [t / samples_per_day for t in range(total_samples)]
    
    # 1. Heart Rate (Resting bpm): Slight increase initially, stabilizes with countermeasure
    hr_base = 65.0
    hr_drift = 3.0 * (1 - np.exp(-np.array(mission_days) / 30.0))
    hr_circadian = 4.0 * np.sin(2 * np.pi * np.array(mission_days))
    hr_noise = np.random.normal(0, 1.8, total_samples)
    heart_rate = np.clip(hr_base + hr_drift + hr_circadian + hr_noise, 48, 110)
    
    # 2. HRV RMSSD (ms): Sympathetic tone increase, HRV decreases over mission
    hrv_base = 52.0
    hrv_drift = -10.0 * (1 - np.exp(-np.array(mission_days) / 45.0))
    hrv_circadian = 3.5 * np.cos(2 * np.pi * np.array(mission_days))
    hrv_noise = np.random.normal(0, 2.5, total_samples)
    hrv = np.clip(hrv_base + hrv_drift + hrv_circadian + hrv_noise, 22, 95)
    
    # 3. Blood Pressure (mmHg): Cephalad fluid shift causes transient elevation
    bp_sys_base = 118.0
    bp_sys_drift = 2.0 * np.sin(np.pi * np.array(mission_days) / 180.0)
    bp_sys = np.clip(bp_sys_base + bp_sys_drift + np.random.normal(0, 3.0, total_samples), 100, 140)
    bp_dia = np.clip(76.0 + 1.2 * np.sin(np.pi * np.array(mission_days) / 180.0) + np.random.normal(0, 2.2, total_samples), 60, 90)
    
    # 4. SpO2 (%): Maintained by ECLSS atmospheric control
    spo2 = np.clip(98.2 + np.random.normal(0, 0.4, total_samples), 95.0, 100.0)
    
    # 5. Core Body Temperature (°C): Circadian shift in space
    temp_base = 36.8
    temp_circadian = 0.4 * np.sin(2 * np.pi * np.array(mission_days) - np.pi / 4)
    temp_noise = np.random.normal(0, 0.1, total_samples)
    temperature = np.clip(temp_base + temp_circadian + temp_noise, 36.1, 37.8)
    
    # 6. Fasting Blood Glucose (mg/dL)
    glucose_base = 90.0
    glucose_drift = 3.0 * (np.array(mission_days) / 180.0)
    glucose = np.clip(glucose_base + glucose_drift + np.random.normal(0, 4.0, total_samples), 75, 125)
    
    # 7. Sleep Duration (hours/day): Orbital 90-min sunrise cycle challenges sleep
    sleep_base = 7.4
    sleep_drift = -0.7 * (1 - np.exp(-np.array(mission_days) / 20.0))
    sleep = np.clip(sleep_base + sleep_drift + np.random.normal(0, 0.5, total_samples), 4.5, 9.0)
    
    # 8. Physical Activity (step equivalents / day): ARED + T2 treadmill compliance
    activity_base = 9200
    activity_noise = np.random.normal(0, 600, total_samples)
    activity = np.clip(activity_base + activity_noise, 4000, 14000).astype(int)
    
    # 9. Allostatic Stress Index (0-100)
    stress_base = 22.0
    stress_drift = 16.0 * (1 - np.exp(-np.array(mission_days) / 40.0))
    stress = np.clip(stress_base + stress_drift + np.random.normal(0, 4.0, total_samples), 10, 85)
    
    # 10. Bone Mineral Density loss rate (%/mo)
    bmd_rate = -0.78 + np.random.normal(0, 0.05, total_samples)
    
    # 11. Multi-Dimensional Adaptation Index (ARI 0-100)
    ari_score = np.clip(
        100 - (
            (heart_rate - hr_base) * 0.4 +
            (hrv_base - hrv) * 0.5 +
            (stress - stress_base) * 0.4 +
            (sleep_base - sleep) * 4.0
        ),
        40, 98
    )
    
    df = pd.DataFrame({
        'timestamp': [t.isoformat() for t in timestamps],
        'mission_day': np.round(mission_days, 2),
        'heart_rate': np.round(heart_rate, 1),
        'hrv_rmssd': np.round(hrv, 1),
        'bp_systolic': np.round(bp_sys, 1),
        'bp_diastolic': np.round(bp_dia, 1),
        'spo2': np.round(spo2, 1),
        'core_temperature': np.round(temperature, 2),
        'glucose': np.round(glucose, 1),
        'sleep_duration': np.round(sleep, 2),
        'activity_steps': activity,
        'stress_score': np.round(stress, 1),
        'bmd_loss_rate': np.round(bmd_rate, 3),
        'ari_score': np.round(ari_score, 1),
        'data_type': 'SYNTHETIC_DEMONSTRATION',
    })
    
    return df

if __name__ == '__main__':
    output_dir = os.path.dirname(os.path.abspath(__file__))
    df = generate_mission_dataset(days=180, samples_per_day=4)
    
    csv_path = os.path.join(output_dir, 'mission_expedition_74.csv')
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} telemetry records -> {csv_path}")
    
    # Also save to processed directory
    processed_dir = os.path.abspath(os.path.join(output_dir, '..', 'processed'))
    os.makedirs(processed_dir, exist_ok=True)
    processed_csv = os.path.join(processed_dir, 'preprocessed_telemetry.csv')
    df.to_csv(processed_csv, index=False)
    print(f"Saved processed dataset -> {processed_csv}")
