@echo off
cd /d "%~dp0"
title Love Live! Costume Archive

echo ========================================================
echo   Love Live! Costume Archive
echo   Starting local servers and opening browser...
echo ========================================================
echo.

:: Launch browser in background after 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

:: Run servers via call
call pnpm run dev
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Server exited with code %errorlevel%.
  pause
)
