@echo off
echo === Activating virtual environment ===
call venv\Scripts\activate

echo.
echo === Starting FastAPI server ===
start "FastAPI Server" cmd /k "uvicorn app:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 4 >nul

echo.
echo === Starting Ngrok tunnel on port 8000 ===
start "Ngrok Tunnel" cmd /k "ngrok http 8000"

echo.
echo === Done. Wait for Ngrok to show the public URL ===
pause
