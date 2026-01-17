"""
VieNeu TTS Studio - FastAPI Backend
Provides REST API for TTS generation, voice cloning, and training management.
"""

import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add VieNeu-TTS to path
VIENEU_PATH = Path(__file__).parent.parent.parent / "VieNeu-TTS"
sys.path.insert(0, str(VIENEU_PATH))

load_dotenv()

app = FastAPI(
    title="VieNeu TTS Studio API",
    description="API for Vietnamese Text-to-Speech with voice cloning",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from api.tts import router as tts_router
from api.models import router as models_router
from api.training import router as training_router
from api.history import router as history_router

app.include_router(tts_router, prefix="/api/tts", tags=["TTS"])
app.include_router(models_router, prefix="/api/models", tags=["Models"])
app.include_router(training_router, prefix="/api/training", tags=["Training"])
app.include_router(history_router, prefix="/api/history", tags=["History"])


@app.get("/")
async def root():
    return {"status": "ok", "message": "VieNeu TTS Studio API"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "gpu_available": True,  # TODO: Check actual GPU status
        "model_loaded": False,  # TODO: Check model status
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
