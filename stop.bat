@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 停止 Love Live! 衣装资料库服务

echo 正在停止占用 5173 (前端) 和 3001 (后端) 端口的本地服务...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo.
echo ✓ 本地前后端服务已全部停止。
timeout /t 2 /nobreak >nul
