@echo off
chcp 65001 >nul
title VieNeu TTS Studio - Full Stack

echo.
echo ╔════════════════════════════════════════════════╗
echo ║     VieNeu TTS Studio - Full Stack Start       ║
echo ╚════════════════════════════════════════════════╝
echo.

:: Kill existing processes
echo [1/4] Stopping existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 :8000"') do (
    taskkill /F /PID %%a >nul 2>&1
)
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq next-server*" >nul 2>&1
taskkill /F /IM "python.exe" /FI "WINDOWTITLE eq uvicorn*" >nul 2>&1

:: Remove lock files
echo [2/4] Cleaning up lock files...
if exist ".next\dev\lock" del /F /Q ".next\dev\lock" >nul 2>&1
timeout /t 1 /nobreak >nul

cd /d "%~dp0"

:: Start Backend in new window
echo [3/4] Starting Backend (port 8000)...
start "VieNeu Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend
echo [4/4] Starting Frontend (port 3000)...
echo.
echo ─────────────────────────────────────────────────
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   Press Ctrl+C to stop frontend
echo ─────────────────────────────────────────────────
echo.

npm run dev

pause
