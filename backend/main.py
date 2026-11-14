"""ADAPT-X FastAPI Backend — Astronaut Health Intelligence Platform
NASA Space Apps Challenge 2026: Adaptive Digital Twin & Physiological Reverse Engineering System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.models.database import init_db
from app.routers import (
    astronaut,
    metrics,
    adaptation,
    environment,
    predictions,
    simulation,
    datasets,
    models_registry,
    websocket,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 60)
    print("ADAPT-X Mission Health Intelligence Platform: Initializing...")
    # Initialize SQLAlchemy database & seed 180-day mission telemetry
    init_db()
    print("ADAPT-X Backend: All routers & ML engines operational.")
    print("=" * 60)
    yield
    print("ADAPT-X Backend: Graceful shutdown completed.")

app = FastAPI(
    title="ADAPT-X Mission Health API",
    description="Adaptive Digital Twin & Physiological Reverse Engineering System for Long-Duration Human Spaceflight",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include Modular Routers
app.include_router(astronaut.router, prefix=settings.API_V1_STR)
app.include_router(metrics.router, prefix=settings.API_V1_STR)
app.include_router(adaptation.router, prefix=settings.API_V1_STR)
app.include_router(environment.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(datasets.router, prefix=settings.API_V1_STR)
app.include_router(models_registry.router, prefix=settings.API_V1_STR)
app.include_router(websocket.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "ADAPT-X",
        "version": "1.0.0",
        "description": "Adaptive Digital Twin & Physiological Reverse Engineering System",
        "docs": "/api/docs",
        "mission": "ARTEMIS-VII / ISS EXPEDITION 74"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "ADAPT-X Backend",
        "telemetry_stream": "ONLINE",
        "ml_inference_engine": "OPERATIONAL"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
