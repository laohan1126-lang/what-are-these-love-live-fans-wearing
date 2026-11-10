@echo off
cd /d "%~dp0"
title Stop Love Live! Costume Archive

echo Stopping servers on port 5173 and 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo.
echo All services stopped.
timeout /t 2 /nobreak >nul
