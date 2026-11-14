"""ADAPT-X Core Configuration"""
import os

class Settings:
    PROJECT_NAME: str = "ADAPT-X"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./adaptx.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Real-time WebSocket telemetry frequency (Hz)
    TELEMETRY_STREAM_HZ: float = 1.0

settings = Settings()
