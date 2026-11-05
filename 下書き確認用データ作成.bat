@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo 正本（Excel）の下書きを含めて、WG 確認用の data.js を作ります。
echo この data.js は push しないでください（push 前に 本番用データ作成.bat を実行）。
echo.
python tools\build_data.py --drafts
echo.
pause
