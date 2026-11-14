"""WebSocket Real-Time Astronaut Telemetry Stream Router"""
import asyncio
import json
import random
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["WebSocket Real-Time Telemetry"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"WebSocket: Client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"WebSocket: Client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Real-time bi-directional WebSocket connection streaming live vital telemetry at 1Hz."""
    await manager.connect(websocket)
    
    # State variables for natural physiological drift
    current_hr = 68.0
    current_hrv = 42.0
    current_spo2 = 98.4
    current_stress = 38.0
    
    try:
        while True:
            # Check for incoming client messages with timeout
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                cmd = json.loads(data)
                if cmd.get("action") == "trigger_exercise":
                    current_hr = 125.0
                    current_stress = 55.0
                elif cmd.get("action") == "reset":
                    current_hr = 68.0
            except asyncio.TimeoutError:
                pass
            except Exception:
                pass

            # Simulate natural physiological oscillations (respiratory sinus arrhythmia)
            now = datetime.now(timezone.utc)
            t = now.timestamp()
            
            # Respiratory wave modulation (0.25 Hz = ~15 breaths/min)
            resp_wave = np_sin = 2.0 * random.uniform(-0.8, 0.8)
            live_hr = round(current_hr + resp_wave + random.gauss(0, 0.5), 1)
            live_hrv = round(max(20.0, current_hrv + random.gauss(0, 1.2)), 1)
            live_spo2 = round(min(100.0, max(95.0, current_spo2 + random.gauss(0, 0.1))), 1)
            live_bp_sys = round(118.0 + random.gauss(0, 1.5), 1)
            live_bp_dia = round(76.0 + random.gauss(0, 1.0), 1)
            
            payload = {
                "event": "VITAL_STREAM",
                "timestamp": now.isoformat(),
                "mission_day": 142.36,
                "vitals": {
                    "heart_rate": live_hr,
                    "hrv_rmssd": live_hrv,
                    "bp_systolic": live_bp_sys,
                    "bp_diastolic": live_bp_dia,
                    "spo2": live_spo2,
                    "core_temperature": 36.75,
                    "glucose": 92.0,
                    "stress_score": current_stress,
                    "activity_steps": 8240,
                },
                "status": "NOMINAL",
                "link_quality": "100% ISS KU-BAND LEO",
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(1.0)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)
