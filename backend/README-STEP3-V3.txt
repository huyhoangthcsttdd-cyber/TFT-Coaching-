TFT Coach — Step 3 v3

Fix: rounds.id UUID.
The frontend may send a local round id such as 1790563504806-3-2.
The backend now always generates a UUID for Supabase rounds.id.
Do not replace the frontend.

Run backend:
cd D:\TFT-Coach-Step3-Supabase-Fixed\backend
python -m uvicorn main:app --reload --port 8000
