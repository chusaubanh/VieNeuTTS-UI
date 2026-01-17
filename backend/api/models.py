"""
Models API Router - LoRA adapter management
"""

import os
import shutil
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

router = APIRouter()

MODELS_DIR = Path(__file__).parent.parent / "storage" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


class LoraModel(BaseModel):
    id: str
    name: str
    description: str
    source: str  # "local" or "huggingface"
    repo_id: Optional[str] = None
    is_active: bool = False


class ImportRequest(BaseModel):
    repo_id: str


# In-memory model registry (in production, use SQLite or similar)
_models_registry: List[LoraModel] = [
    LoraModel(
        id="ngoc-huyen",
        name="Ngọc Huyền",
        description="Giọng nữ miền Nam, trẻ trung - Vbee",
        source="huggingface",
        repo_id="pnnbao-ump/VieNeu-TTS-0.3B-lora-ngoc-huyen",
        is_active=True,
    )
]


@router.get("/", response_model=List[LoraModel])
async def list_models():
    """List all available LoRA models"""
    return _models_registry


@router.post("/import")
async def import_model(request: ImportRequest):
    """Import LoRA model from HuggingFace"""
    
    repo_id = request.repo_id.strip()
    if not repo_id:
        raise HTTPException(status_code=400, detail="Repository ID required")
    
    # Check if already imported
    if any(m.repo_id == repo_id for m in _models_registry):
        raise HTTPException(status_code=400, detail="Model already imported")
    
    try:
        # Download from HuggingFace
        from huggingface_hub import snapshot_download
        
        model_id = repo_id.split("/")[-1]
        local_path = MODELS_DIR / model_id
        
        snapshot_download(
            repo_id=repo_id,
            local_dir=str(local_path),
        )
        
        # Add to registry
        new_model = LoraModel(
            id=model_id,
            name=model_id.replace("-", " ").title(),
            description=f"Imported from {repo_id}",
            source="huggingface",
            repo_id=repo_id,
            is_active=False,
        )
        _models_registry.append(new_model)
        
        return {"status": "success", "model": new_model}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{model_id}/activate")
async def activate_model(model_id: str):
    """Set a model as the active model"""
    
    found = False
    for model in _models_registry:
        if model.id == model_id:
            model.is_active = True
            found = True
        else:
            model.is_active = False
    
    if not found:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # TODO: Actually reload the model in TTS engine
    
    return {"status": "success", "active_model": model_id}


@router.delete("/{model_id}")
async def delete_model(model_id: str):
    """Delete a LoRA model"""
    
    global _models_registry
    
    model = next((m for m in _models_registry if m.id == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    if model.is_active:
        raise HTTPException(status_code=400, detail="Cannot delete active model")
    
    # Remove from filesystem if exists
    model_path = MODELS_DIR / model_id
    if model_path.exists():
        shutil.rmtree(model_path)
    
    # Remove from registry
    _models_registry = [m for m in _models_registry if m.id != model_id]
    
    return {"status": "success"}


@router.post("/{model_id}/test")
async def test_model(model_id: str, text: str = "Xin chào, đây là giọng nói thử nghiệm."):
    """Quick test a model with sample text"""
    
    model = next((m for m in _models_registry if m.id == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # TODO: Generate test audio
    
    return {
        "status": "success",
        "audio_url": f"/api/tts/audio/test_{model_id}",
    }
