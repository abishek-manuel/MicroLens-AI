---
name: run-website
description: >-
  Use this skill whenever the user asks you to "run the website", "start the project", or "run this app" in this workspace. It starts both the frontend and the backend.
---

# Running the Micro Lens AI YOLOv12 Project

When the user asks you to run the website, you should follow these steps:

## 1. Start the Frontend (Vite)
- Run `npm run dev` in the root directory `c:\college\yolo12`.
- Run this in the background (`IsDaemon=true`).

## 2. Start the Backend (FastAPI)
- Run `uvicorn main:app --reload --port 8000` in the `c:\college\yolo12\backend` directory.
- Run this in the background (`IsDaemon=true`).

## 3. Inform the User
Let the user know that the servers are running:
- **Frontend**: http://localhost:5174/ (or whichever port Vite assigned)
- **Backend**: http://localhost:8000/
