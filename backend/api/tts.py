"""
TTS API Router - Text-to-Speech generation endpoints
"""

import os
import uuid
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

router = APIRouter()

# Storage paths
AUDIO_DIR = Path(__file__).parent.parent / "storage" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


class TTSRequest(BaseModel):
    text: str
    voice_id: str = "ngoc-huyen"
    streaming: bool = False


class TTSResponse(BaseModel):
    id: str
    text: str
    voice: str
    audio_url: str
    duration: float
    created_at: str


# TTS engine singleton
_tts_engine = None


def get_tts_engine():
    global _tts_engine
    if _tts_engine is None:
        try:
            from vieneu import Vieneu
            _tts_engine = Vieneu()
            # Load default LoRA
            _tts_engine.load_lora_adapter("pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen")
        except ImportError:
            raise HTTPException(
                status_code=503,
                detail="VieNeu SDK not installed. Run 'pip install vieneu' first."
            )
    return _tts_engine


@router.post("/generate", response_model=TTSResponse)
async def generate_speech(request: TTSRequest):
    """Generate speech from text using selected voice"""
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 500:
        raise HTTPException(status_code=400, detail="Text too long (max 500 chars)")
    
    try:
        tts = get_tts_engine()
        
        # Generate audio
        audio = tts.infer(text=request.text)
        
        # Save to file
        audio_id = str(uuid.uuid4())
        audio_path = AUDIO_DIR / f"{audio_id}.wav"
        tts.save(audio, str(audio_path))
        
        # Get duration (approximate: text length / 10 chars per second)
        duration = len(request.text) / 10.0
        
        return TTSResponse(
            id=audio_id,
            text=request.text,
            voice=request.voice_id,
            audio_url=f"/api/tts/audio/{audio_id}",
            duration=duration,
            created_at=datetime.now().isoformat(),
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clone")
async def clone_voice(
    text: str = Form(...),
    ref_text: str = Form(...),
    ref_audio: UploadFile = File(...),
):
    """Clone voice from reference audio and generate speech"""
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        tts = get_tts_engine()
        
        # Save uploaded reference audio temporarily
        temp_ref_path = AUDIO_DIR / f"temp_ref_{uuid.uuid4()}.wav"
        with open(temp_ref_path, "wb") as f:
            content = await ref_audio.read()
            f.write(content)
        
        # Generate with voice cloning
        audio = tts.infer(
            text=text,
            ref_audio=str(temp_ref_path),
            ref_text=ref_text,
        )
        
        # Save output
        audio_id = str(uuid.uuid4())
        audio_path = AUDIO_DIR / f"{audio_id}.wav"
        tts.save(audio, str(audio_path))
        
        # Cleanup temp file
        temp_ref_path.unlink(missing_ok=True)
        
        return TTSResponse(
            id=audio_id,
            text=text,
            voice="cloned",
            audio_url=f"/api/tts/audio/{audio_id}",
            duration=len(text) / 10.0,
            created_at=datetime.now().isoformat(),
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/{audio_id}")
async def get_audio(audio_id: str):
    """Download generated audio file"""
    
    audio_path = AUDIO_DIR / f"{audio_id}.wav"
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename=f"vieneu_{audio_id}.wav",
    )


@router.get("/voices")
async def list_voices():
    """List available voices including presets and LoRA adapters"""
    
    return {
        "voices": [
            {
                "id": "ngoc-huyen",
                "name": "Ngọc Huyền",
                "description": "Giọng nữ miền Nam, trẻ trung",
                "type": "lora",
            },
            {
                "id": "default",
                "name": "Default Voice",
                "description": "Giọng mặc định VieNeu-TTS",
                "type": "preset",
            },
        ]
    }
