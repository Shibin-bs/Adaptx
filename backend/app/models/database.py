"""ADAPT-X SQLAlchemy Database Models & Initialization"""
import os
import pandas as pd
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Text, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from ..core.config import settings

Base = declarative_base()

class Astronaut(Base):
    __tablename__ = "astronauts"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    rank = Column(String(100), nullable=False)
    mission = Column(String(100), nullable=False)
    expedition = Column(String(50), nullable=False)
    mission_day = Column(Integer, nullable=False)
    mission_duration_planned = Column(Integer, nullable=False)
    location = Column(String(150), nullable=False)
    altitude_km = Column(Float, nullable=False)
    overall_health_status = Column(String(50), nullable=False)
    health_score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BiometricTelemetry(Base):
    __tablename__ = "biometric_telemetry"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    astronaut_id = Column(String(50), default="ast-001")
    timestamp = Column(DateTime, nullable=False)
    mission_day = Column(Float, nullable=False)
    heart_rate = Column(Float, nullable=False)
    hrv_rmssd = Column(Float, nullable=False)
    bp_systolic = Column(Float, nullable=False)
    bp_diastolic = Column(Float, nullable=False)
    spo2 = Column(Float, nullable=False)
    core_temperature = Column(Float, nullable=False)
    glucose = Column(Float, nullable=False)
    sleep_duration = Column(Float, nullable=False)
    activity_steps = Column(Integer, nullable=False)
    stress_score = Column(Float, nullable=False)
    bmd_loss_rate = Column(Float, nullable=False)
    ari_score = Column(Float, nullable=False)
    data_type = Column(String(50), default="SYNTHETIC_DEMONSTRATION")

class EnvironmentalTelemetry(Base):
    __tablename__ = "environmental_telemetry"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    cabin_temperature = Column(Float, default=21.5)
    cabin_pressure = Column(Float, default=101.3)
    o2_concentration = Column(Float, default=21.0)
    co2_concentration = Column(Float, default=0.52)
    radiation_rate_msv_day = Column(Float, default=1.84)
    gravity_vector_g = Column(Float, default=0.001)

class AdaptationAssessment(Base):
    __tablename__ = "adaptation_assessments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    astronaut_id = Column(String(50), default="ast-001")
    mission_day = Column(Integer, default=142)
    cardiovascular_score = Column(Float, default=74.0)
    musculoskeletal_score = Column(Float, default=68.0)
    circadian_score = Column(Float, default=61.0)
    metabolic_score = Column(Float, default=82.0)
    behavioural_score = Column(Float, default=71.0)
    overall_ari = Column(Float, default=71.2)
    classification = Column(String(50), default="ACTIVE_ADAPTATION")

class InterventionSimulation(Base):
    __tablename__ = "intervention_simulations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    astronaut_id = Column(String(50), default="ast-001")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    exercise_adherence = Column(Float, nullable=False)
    dietary_countermeasure = Column(Boolean, default=True)
    radiation_shield_factor = Column(Float, default=1.0)
    simulated_vo2_max = Column(Float, nullable=False)
    simulated_bmd_rate = Column(Float, nullable=False)
    orthostatic_risk = Column(String(50), nullable=False)

# Database Engine & Session
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Seed Astronaut if not present
    if not db.query(Astronaut).first():
        astronaut = Astronaut(
            id="ast-001",
            name="Dr. Sarah Chen",
            rank="Mission Commander",
            mission="ARTEMIS-VII",
            expedition="Expedition 74",
            mission_day=142,
            mission_duration_planned=180,
            location="ISS — Low Earth Orbit",
            altitude_km=408.0,
            overall_health_status="NOMINAL",
            health_score=87,
        )
        db.add(astronaut)
        db.commit()
        print("Seeded Commander Dr. Sarah Chen into database.")
        
    # 2. Seed Biometric telemetry from preprocessed CSV if empty
    if not db.query(BiometricTelemetry).first():
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'processed', 'preprocessed_telemetry.csv'))
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            records = []
            for _, row in df.iterrows():
                records.append(BiometricTelemetry(
                    astronaut_id="ast-001",
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    mission_day=float(row['mission_day']),
                    heart_rate=float(row['heart_rate']),
                    hrv_rmssd=float(row['hrv_rmssd']),
                    bp_systolic=float(row['bp_systolic']),
                    bp_diastolic=float(row['bp_diastolic']),
                    spo2=float(row['spo2']),
                    core_temperature=float(row['core_temperature']),
                    glucose=float(row['glucose']),
                    sleep_duration=float(row['sleep_duration']),
                    activity_steps=int(row['activity_steps']),
                    stress_score=float(row['stress_score']),
                    bmd_loss_rate=float(row['bmd_loss_rate']),
                    ari_score=float(row['ari_score']),
                ))
            db.bulk_save_objects(records)
            db.commit()
            print(f"Seeded {len(records)} biometric telemetry rows into database.")
            
    db.close()
