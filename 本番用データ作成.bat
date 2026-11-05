@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo 正本（Excel）の「承認済み」の行だけで、本番用の data.js を作ります。
echo.
python tools\build_data.py
echo.
pause
