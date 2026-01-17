"""
TTS API Router - Text-to-Speech generation endpoints
"""

import os
import uuid
import random
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel

router = APIRouter()

# Output folder - relative to project root
PROJECT_ROOT = Path(__file__).parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "Output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class TTSRequest(BaseModel):
    text: str
    voice_id: str = "ngoc-huyen"


class TTSResponse(BaseModel):
    id: str
    text: str
    voice: str
    audio_url: str
    filename: str
    duration: float
    created_at: str


# TTS engine singleton
_tts_engine = None


def get_tts_engine():
    """Initialize VieNeu TTS engine"""
    global _tts_engine
    if _tts_engine is None:
        try:
            from vieneu import Vieneu
            _tts_engine = Vieneu()
            # Load default LoRA
            _tts_engine.load_lora_adapter("pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen")
            print("[VieNeu] Engine loaded successfully")
        except ImportError as e:
            print(f"[VieNeu] SDK not installed: {e}")
            raise HTTPException(
                status_code=503,
                detail="VieNeu SDK not installed. Run 'pip install vieneu' first."
            )
        except Exception as e:
            print(f"[VieNeu] Error loading engine: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    return _tts_engine


def generate_filename():
    """Generate filename: VieNeuStudio-{random 8 digits}"""
    random_id = random.randint(10000000, 99999999)
    return f"VieNeuStudio-{random_id}"


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
        
        # Generate filename and save
        base_filename = generate_filename()
        audio_filename = f"{base_filename}.wav"
        audio_path = OUTPUT_DIR / audio_filename
        
        tts.save(audio, str(audio_path))
        
        # Get duration (approximate: text length / 10 chars per second)
        duration = len(request.text) / 10.0
        
        return TTSResponse(
            id=base_filename,
            text=request.text,
            voice=request.voice_id,
            audio_url=f"/api/tts/audio/{base_filename}",
            filename=audio_filename,
            duration=duration,
            created_at=datetime.now().isoformat(),
        )
    
    except HTTPException:
        raise
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
        temp_ref_path = OUTPUT_DIR / f"temp_ref_{uuid.uuid4()}.wav"
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
        base_filename = generate_filename()
        audio_filename = f"{base_filename}.wav"
        audio_path = OUTPUT_DIR / audio_filename
        tts.save(audio, str(audio_path))
        
        # Cleanup temp file
        temp_ref_path.unlink(missing_ok=True)
        
        return TTSResponse(
            id=base_filename,
            text=text,
            voice="cloned",
            audio_url=f"/api/tts/audio/{base_filename}",
            filename=audio_filename,
            duration=len(text) / 10.0,
            created_at=datetime.now().isoformat(),
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/{audio_id}")
async def get_audio(audio_id: str):
    """Get generated audio file"""
    
    audio_path = OUTPUT_DIR / f"{audio_id}.wav"
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename=f"{audio_id}.wav",
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


@router.get("/output-files")
async def list_output_files():
    """List all generated audio files in Output folder"""
    
    files = []
    for f in OUTPUT_DIR.glob("VieNeuStudio-*.wav"):
        files.append({
            "filename": f.name,
            "size": f.stat().st_size,
            "created": datetime.fromtimestamp(f.stat().st_ctime).isoformat(),
        })
    
    return {"files": sorted(files, key=lambda x: x["created"], reverse=True)}
