@echo off
chcp 65001 >nul
title VieNeu TTS Studio

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           VieNeu TTS Studio - One-Click Start              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: Kill existing processes on ports
echo [1/6] Dừng các process cũ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 :8000" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Remove Next.js lock file
if exist ".next\dev\lock" del /F /Q ".next\dev\lock" >nul 2>&1
timeout /t 1 /nobreak >nul

:: Check if node_modules exists
if not exist "node_modules" (
    echo [2/6] Cài đặt dependencies frontend...
    call npm install
) else (
    echo [2/6] Frontend dependencies OK
)

:: Install Python dependencies including VieNeu and librosa
echo [3/6] Cài đặt Python dependencies...
pip install fastapi uvicorn python-multipart aiofiles pydantic python-dotenv --quiet 2>nul

echo [4/6] Cài đặt VieNeu TTS SDK + dependencies...
pip install vieneu librosa soundfile numpy scipy --quiet 2>nul

:: Create Output folder
if not exist "Output" mkdir Output

:: Start Backend in background
echo [5/6] Khởi động Backend (port 8000)...
start /B "" cmd /c "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 2>nul"

:: Wait for backend
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [6/6] Khởi động Frontend (port 3000)...
echo.
echo ═══════════════════════════════════════════════════════════════
echo      ✅ VieNeu TTS Studio đang chạy!
echo.
echo      🌐 Frontend:  http://localhost:3000
echo      🔌 Backend:   http://localhost:8000
echo.
echo      📁 Output:    %~dp0Output\
echo.
echo      Nhấn Ctrl+C để dừng
echo ═══════════════════════════════════════════════════════════════
echo.

npm run dev
