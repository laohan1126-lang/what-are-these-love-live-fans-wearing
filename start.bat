@echo off
cd /d "%~dp0"
title Love Live! Costume Archive

echo ========================================================
echo   Love Live! Costume Archive
echo   Starting local servers and opening browser...
echo ========================================================
echo.

:: Run servers via call (Vite will automatically open the browser once ready)
call pnpm run dev
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Server exited with code %errorlevel%.
  pause
)
