@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Love Live! 衣装资料库 - 決意の光

echo ========================================================
echo   Love Live! 衣装资料库 (你们这些拉拉人穿的到底是什么)
echo   正在启动本地服务并自动打开浏览器...
echo ========================================================
echo.

:: 在后台延迟 3 秒自动呼起默认浏览器打开前端页面
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

:: 启动前端 Vite 与后端 Node.js API 联合开发服务
pnpm run dev
