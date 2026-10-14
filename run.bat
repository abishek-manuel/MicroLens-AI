@echo off
echo ===================================================
echo Starting Micro Lens AI YOLOv12 Project
echo ===================================================

echo Starting the React frontend...
start "Frontend (Vite)" cmd /k "npm run dev"

echo Starting the Python FastAPI backend...
start "Backend (FastAPI)" cmd /k "cd backend && uvicorn main:app --reload --port 8000"

echo Both services have been started in new windows!
echo Frontend: http://localhost:5174 (Check the frontend terminal if the port differs)
echo Backend: http://localhost:8000
