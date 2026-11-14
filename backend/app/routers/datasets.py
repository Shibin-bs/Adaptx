"""NASA Open Science & Synthetic Dataset Registry Router"""
import os
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from ..models.schemas import DatasetRegistryResponse

router = APIRouter(prefix="/datasets", tags=["Dataset Explorer"])

@router.get("/registry", response_model=DatasetRegistryResponse)
async def get_dataset_registry():
    """Return catalog of NASA OSDR spaceflight datasets and active synthetic telemetry streams."""
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
                "loaded": True,
                "note": "Public NASA OSDR repository study. 11 flight timepoints indexed.",
            },
            {
                "id": "NASA-OSDR-OSD-569",
                "name": "NASA Spaceflight Standard Measures Cross-Mission Dataset",
                "source": "NASA Life Sciences Data Archive (LSDA)",
                "url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-569",
                "variables": ["Bone Mineral Density", "Muscle Volume", "VO2 Max", "Orthostatic Tolerance", "SANS"],
                "subjects": 42,
                "status": "AVAILABLE",
                "loaded": True,
                "note": "Standardized longitudinal physiological collection protocol across ISS Expeditions.",
            },
            {
                "id": "NASA-TWINS-STUDY-001",
                "name": "NASA Twins Study Longitudinal Multi-Omics Dataset",
                "source": "NASA Human Research Program",
                "url": "https://www.nasa.gov/twins-study",
                "variables": ["Cognitive Battery", "Telomere Length", "Epigenetic Ageing", "Carotid IMT"],
                "subjects": 2,
                "status": "AVAILABLE",
                "loaded": True,
                "note": "Benchmark reference dataset for 340-day orbital spaceflight adaptation.",
            },
            {
                "id": "SYNTHETIC-ADAPT-X-001",
                "name": "ADAPT-X High-Fidelity Synthetic Spacecraft Stream",
                "source": "ADAPT-X Physiological Intelligence Simulator",
                "url": None,
                "variables": ["Heart Rate", "HRV (RMSSD)", "Blood Pressure", "SpO2", "Core Temp", "Glucose", "Sleep", "Activity", "Stress", "ARI"],
                "subjects": 1,
                "status": "ACTIVE_STREAMING",
                "loaded": True,
                "note": "Active real-time simulation stream for CDR Dr. Sarah Chen. 180-day longitudinal model.",
            },
        ]
    }

@router.get("/nasa/{study_id}")
async def get_nasa_study_detail(study_id: str):
    """Retrieve detailed metadata, assays, and findings for a given NASA OSDR study."""
    meta_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'nasa', 'osdr_metadata.json'))
    if not os.path.exists(meta_path):
        raise HTTPException(status_code=404, detail="NASA metadata file not found.")
        
    with open(meta_path, 'r') as f:
        data = json.load(f)
        
    for study in data.get("studies", []):
        if study.get("id") == study_id or study.get("accession") == study_id:
            return study
            
    raise HTTPException(status_code=404, detail=f"Study '{study_id}' not found in NASA OSDR registry.")

@router.get("/export")
async def export_telemetry_csv():
    """Download the 180-day mission telemetry dataset as a CSV file."""
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'synthetic', 'mission_expedition_74.csv'))
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Telemetry CSV file not found.")
        
    return FileResponse(
        csv_path,
        media_type="text/csv",
        filename="adaptx_mission_expedition_74_telemetry.csv"
    )

@router.get("/telemetry-samples")
async def get_telemetry_samples(limit: int = 50, offset: int = 0):
    """Return paginated samples of the processed 180-day mission telemetry dataset."""
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'processed', 'preprocessed_telemetry.csv'))
    if not os.path.exists(csv_path):
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'datasets', 'synthetic', 'mission_expedition_74.csv'))
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Processed telemetry dataset not found.")
        
    import pandas as pd
    df = pd.read_csv(csv_path)
    total_records = len(df)
    subset = df.iloc[offset:offset + limit].fillna(0)
    records = subset.to_dict(orient="records")
    return {
        "total": total_records,
        "offset": offset,
        "limit": limit,
        "records": records
    }
