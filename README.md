# ADAPT-X — Adaptive Digital Twin & Physiological Reverse Engineering System

> NASA Space Apps Challenge 2026 — Astronaut Health Intelligence Platform

## Overview

ADAPT-X is an AI-powered astronaut health monitoring platform that creates personalized physiological digital twins, predicts health deviations before they occur, and provides mission-critical medical insights for long-duration spaceflight.

## Project Structure

```
C:\Adaptx\
├── frontend/          React + Vite + TypeScript + Tailwind + Three.js
├── backend/           Python FastAPI REST API + WebSocket server
├── ml/                Machine Learning models (XGBoost, scikit-learn)
├── datasets/          NASA Open Data + synthetic physiological data
├── assets/3d/         3D GLB/GLTF human body models
├── README.md
└── .env.example
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000/api/docs
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Three.js, Framer Motion |
| 3D Rendering | @react-three/fiber, @react-three/drei |
| State | Zustand |
| Charts | Recharts |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| ML | scikit-learn, XGBoost, NumPy, Pandas |
| Database | PostgreSQL + SQLAlchemy + Alembic |

## Key Features

- 🧬 **Physiological Digital Twin** — Real-time 3D human body model with health overlays
- 📊 **Predictive Analytics** — ML models forecast health deviations 24–72 hours ahead
- 🚨 **Anomaly Detection** — Automatic flagging of critical biomarker changes
- 🌐 **Mission Dashboard** — Live telemetry, mission timeline, crew health status
- 🔬 **Bone & Muscle Tracking** — Microgravity-induced degradation modeling

## Data Sources

- NASA Open Data Portal
- NASA Life Sciences Data Archive (LSDA)
- Synthetic physiological data (demonstration)

---
*NASA Space Apps Challenge 2026 — Team ADAPT-X*
