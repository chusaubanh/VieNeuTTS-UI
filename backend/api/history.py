"""
History API Router - Generated audio history
"""

import os
from pathlib import Path
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()

AUDIO_DIR = Path(__file__).parent.parent / "storage" / "audio"


class HistoryItem(BaseModel):
    id: str
    text: str
    voice: str
    duration: float
    created_at: str
    audio_url: str


# In-memory history (in production, use SQLite)
_history: List[HistoryItem] = []


def add_to_history(item: HistoryItem):
    """Add item to history (called from TTS router)"""
    _history.insert(0, item)
    # Keep only last 100 items
    if len(_history) > 100:
        _history.pop()


@router.get("/", response_model=List[HistoryItem])
async def get_history(limit: int = 50, offset: int = 0):
    """Get generation history"""
    return _history[offset : offset + limit]


@router.get("/{item_id}")
async def get_history_item(item_id: str):
    """Get a specific history item"""
    item = next((h for h in _history if h.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.get("/{item_id}/audio")
async def download_history_audio(item_id: str):
    """Download audio from history"""
    
    audio_path = AUDIO_DIR / f"{item_id}.wav"
    if not audio_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename=f"vieneu_{item_id}.wav",
    )


@router.delete("/{item_id}")
async def delete_history_item(item_id: str):
    """Delete a history item"""
    global _history
    
    item = next((h for h in _history if h.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Delete audio file
    audio_path = AUDIO_DIR / f"{item_id}.wav"
    if audio_path.exists():
        audio_path.unlink()
    
    # Remove from history
    _history = [h for h in _history if h.id != item_id]
    
    return {"status": "deleted"}


@router.delete("/")
async def clear_history():
    """Clear all history"""
    global _history
    
    # Delete all audio files
    for item in _history:
        audio_path = AUDIO_DIR / f"{item.id}.wav"
        if audio_path.exists():
            audio_path.unlink()
    
    _history = []
    
    return {"status": "cleared"}
