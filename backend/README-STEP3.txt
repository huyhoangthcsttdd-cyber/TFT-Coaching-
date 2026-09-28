# TFT Coach — Step 3.1 Supabase backend

This build updates only the backend database layer.

## Current database
Supabase PostgreSQL.

## Required backend/.env
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_backend_secret_key
TFT_COACH_DEV_USER_ID=your_supabase_auth_user_uuid

## Important
- SUPABASE_KEY is backend-only. Never put the Secret key in frontend code.
- Step 3 uses TFT_COACH_DEV_USER_ID as a temporary development identity.
- Step 4 will replace this with real authenticated user identity.
- The backend is matched to the current Supabase schema:
  matches: id, user_id, mode, set_name, started_at, finished_at, final_placement, final_hp, status, created_at, updated_at
  rounds: id, match_id, stage, round_type, result, hp, gold, level, xp, streak, snapshot, created_at, updated_at
- The current matches table has no metadata column, so the frontend metadata payload is not persisted in Step 3.
