"""
Training API Router - Fine-tuning management
"""

import asyncio
from pathlib import Path
from typing import Optional
from datetime import datetime
from enum import Enum

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()

TRAINING_DIR = Path(__file__).parent.parent / "storage" / "training"
TRAINING_DIR.mkdir(parents=True, exist_ok=True)


class TrainingStatus(str, Enum):
    IDLE = "idle"
    PREPARING = "preparing"
    TRAINING = "training"
    COMPLETED = "completed"
    ERROR = "error"
    STOPPED = "stopped"


class TrainingConfig(BaseModel):
    base_model: str = "pnnbao-ump/VieNeu-TTS-0.3B"
    max_steps: int = 5000
    learning_rate: str = "2e-4"
    batch_size: int = 4


class TrainingJob(BaseModel):
    id: str
    status: TrainingStatus
    config: TrainingConfig
    progress: int = 0
    current_step: int = 0
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    error: Optional[str] = None


# Current training job
_current_job: Optional[TrainingJob] = None
_training_logs: list = []


@router.get("/status")
async def get_status():
    """Get current training status"""
    return {
        "job": _current_job,
        "logs_count": len(_training_logs),
    }


@router.post("/start")
async def start_training(
    background_tasks: BackgroundTasks,
    base_model: str = Form("pnnbao-ump/VieNeu-TTS-0.3B"),
    max_steps: int = Form(5000),
    learning_rate: str = Form("2e-4"),
    batch_size: int = Form(4),
    dataset: UploadFile = File(...),
    metadata: UploadFile = File(...),
):
    """Start a new training job"""
    
    global _current_job, _training_logs
    
    if _current_job and _current_job.status == TrainingStatus.TRAINING:
        raise HTTPException(
            status_code=400,
            detail="A training job is already running"
        )
    
    # Save uploaded files
    job_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    job_dir = TRAINING_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    
    dataset_path = job_dir / "dataset.zip"
    with open(dataset_path, "wb") as f:
        content = await dataset.read()
        f.write(content)
    
    metadata_path = job_dir / "metadata.csv"
    with open(metadata_path, "wb") as f:
        content = await metadata.read()
        f.write(content)
    
    # Create job
    config = TrainingConfig(
        base_model=base_model,
        max_steps=max_steps,
        learning_rate=learning_rate,
        batch_size=batch_size,
    )
    
    _current_job = TrainingJob(
        id=job_id,
        status=TrainingStatus.PREPARING,
        config=config,
        started_at=datetime.now().isoformat(),
    )
    
    _training_logs = [f"[{datetime.now().strftime('%H:%M:%S')}] Training job started"]
    
    # Start training in background
    background_tasks.add_task(run_training, job_id, job_dir, config)
    
    return {"status": "started", "job_id": job_id}


async def run_training(job_id: str, job_dir: Path, config: TrainingConfig):
    """Background training task"""
    global _current_job, _training_logs
    
    try:
        _current_job.status = TrainingStatus.TRAINING
        _training_logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] Preparing dataset...")
        
        # TODO: Actually run training using VieNeu finetune scripts
        # For now, simulate progress
        for step in range(0, config.max_steps, 100):
            if _current_job.status == TrainingStatus.STOPPED:
                break
            
            await asyncio.sleep(0.5)  # Simulate training time
            _current_job.current_step = step
            _current_job.progress = int((step / config.max_steps) * 100)
            
            if step % 500 == 0:
                _training_logs.append(
                    f"[{datetime.now().strftime('%H:%M:%S')}] Step {step}/{config.max_steps}"
                )
        
        if _current_job.status != TrainingStatus.STOPPED:
            _current_job.status = TrainingStatus.COMPLETED
            _current_job.progress = 100
            _current_job.completed_at = datetime.now().isoformat()
            _training_logs.append(
                f"[{datetime.now().strftime('%H:%M:%S')}] Training completed!"
            )
    
    except Exception as e:
        _current_job.status = TrainingStatus.ERROR
        _current_job.error = str(e)
        _training_logs.append(
            f"[{datetime.now().strftime('%H:%M:%S')}] ERROR: {str(e)}"
        )


@router.post("/stop")
async def stop_training():
    """Stop the current training job"""
    global _current_job, _training_logs
    
    if not _current_job or _current_job.status != TrainingStatus.TRAINING:
        raise HTTPException(status_code=400, detail="No training job running")
    
    _current_job.status = TrainingStatus.STOPPED
    _training_logs.append(
        f"[{datetime.now().strftime('%H:%M:%S')}] Training stopped by user"
    )
    
    return {"status": "stopped"}


@router.get("/logs")
async def get_logs(offset: int = 0):
    """Get training logs"""
    return {
        "logs": _training_logs[offset:],
        "total": len(_training_logs),
    }


@router.get("/logs/stream")
async def stream_logs():
    """Stream training logs via SSE"""
    
    async def log_generator():
        last_index = 0
        while True:
            if last_index < len(_training_logs):
                for log in _training_logs[last_index:]:
                    yield f"data: {log}\n\n"
                last_index = len(_training_logs)
            
            await asyncio.sleep(0.5)
            
            # Stop streaming when training is done
            if _current_job and _current_job.status in [
                TrainingStatus.COMPLETED,
                TrainingStatus.ERROR,
                TrainingStatus.STOPPED,
            ]:
                yield f"data: [END]\n\n"
                break
    
    return StreamingResponse(
        log_generator(),
        media_type="text/event-stream",
    )
