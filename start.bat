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
echo [1/7] Dừng các process cũ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 :8000" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Remove Next.js lock file
if exist ".next\dev\lock" del /F /Q ".next\dev\lock" >nul 2>&1
timeout /t 1 /nobreak >nul

:: Check if node_modules exists
if not exist "node_modules" (
    echo [2/7] Cài đặt dependencies frontend...
    call npm install
) else (
    echo [2/7] Frontend dependencies OK
)

:: Install Python backend dependencies
echo [3/7] Cài đặt Python backend dependencies...
pip install fastapi uvicorn python-multipart aiofiles pydantic python-dotenv --quiet 2>nul

:: Install VieNeu SDK with all dependencies
echo [4/7] Cài đặt VieNeu TTS SDK (có thể mất vài phút)...
pip install vieneu --quiet 2>nul
if errorlevel 1 (
    echo      Đang thử cài với --force-reinstall...
    pip install vieneu==1.1.6 --force-reinstall --quiet 2>nul
)

:: Install additional dependencies that VieNeu needs
echo [5/7] Cài đặt audio dependencies...
pip install librosa soundfile scipy numpy --quiet 2>nul

:: Create Output folder
if not exist "Output" mkdir Output

:: Start Backend in background
echo [6/7] Khởi động Backend (port 8000)...
start /B "" cmd /c "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 2>nul"

:: Wait for backend to initialize
echo      Đợi backend khởi động...
timeout /t 5 /nobreak >nul

:: Start Frontend
echo [7/7] Khởi động Frontend (port 3000)...
echo.
echo ═══════════════════════════════════════════════════════════════
echo      ✅ VieNeu TTS Studio đang chạy!
echo.
echo      🌐 Frontend:  http://localhost:3000
echo      🔌 Backend:   http://localhost:8000
echo.
echo      📁 Output:    %~dp0Output\
echo.
echo      ⚠️  Lần đầu chạy, VieNeu sẽ tải model (~2GB)
echo.
echo      Nhấn Ctrl+C để dừng
echo ═══════════════════════════════════════════════════════════════
echo.

npm run dev
