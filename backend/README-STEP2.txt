TFT Coach — Step 2: Frontend ↔ Backend normalization

What changed:
- FastAPI now implements the API endpoints already used by the existing frontend.
- Local SQLite is used only as a temporary persistence layer for Step 2. Online PostgreSQL is Step 3.
- Match, round, review, player profile, player analysis and local AI advice endpoints are available.
- CORS supports Vite ports 5173/5174 and can be configured with CORS_ORIGINS.
- App.jsx no longer hard-codes 127.0.0.1:8000; it uses coachApi.js/VITE_API_URL.
- No authentication or online deployment is introduced yet.

Run backend:
  cd D:\TFT-Coach\backend
  ..\backend\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000

Run frontend:
  cd D:\TFT-Coach\frontend
  npm run dev

Optional frontend .env.local:
  VITE_API_URL=http://127.0.0.1:8000

The generated tft_coach_local.db is local development data. Do not commit it to production.
