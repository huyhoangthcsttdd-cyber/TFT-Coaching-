import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is missing in backend/.env")
if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY is missing in backend/.env")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# =========================================================
# SUPABASE JWT AUTH
# ---------------------------------------------------------
# Frontend gửi:
# Authorization: Bearer <Supabase access token>
#
# Backend xác thực token với Supabase Auth rồi lấy user.id.
# Không còn dùng legacy dev user id để xác định người dùng.
# =========================================================

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict[str, Any]:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    access_token = credentials.credentials.strip()
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing access token",
        )

    try:
        auth_response = supabase.auth.get_user(access_token)
        user = getattr(auth_response, "user", None)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired access token",
            )

        user_id = getattr(user, "id", None)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authenticated user has no id",
            )

        return {"id": str(user_id), "email": getattr(user, "email", None)}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )



app = FastAPI(title="TFT Coach API", version="0.3.1")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,https://tft-coaching-mine.vercel.app",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class MatchCreate(BaseModel):
    mode: str = "normal"
    set_name: str = "Set 18"
    metadata: dict[str, Any] = Field(default_factory=dict)


class RoundSnapshot(BaseModel):
    id: Optional[str] = None
    savedAt: Optional[str] = None
    stage: str = "1-1"
    roundType: str = "PvP"
    result: str = "pending"
    resultLabel: Optional[str] = None
    hp: float = 0
    gold: float = 0
    level: int = 1
    xp: float = 0
    streak: int = 0
    board: list[Any] = Field(default_factory=list)
    selectedItems: list[Any] = Field(default_factory=list)
    selectedAugment: Optional[dict[str, Any]] = None
    boardTraits: list[Any] = Field(default_factory=list)
    coachDecision: Optional[dict[str, Any]] = None


class FinishPayload(BaseModel):
    localRoundCount: Optional[int] = None


def get_match_or_404(match_id: str, user_id: str):
    response = (
        supabase.table("matches")
        .select("*")
        .eq("id", match_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Match not found")
    return response.data[0]


def count_rounds(match_id: str) -> int:
    response = (
        supabase.table("rounds")
        .select("id", count="exact")
        .eq("match_id", match_id)
        .execute()
    )
    return int(response.count or 0)


def match_row(row: dict[str, Any]):
    return {
        "id": row["id"],
        "mode": row.get("mode"),
        "setName": row.get("set_name"),
        "status": row.get("status"),
        "startedAt": row.get("started_at"),
        "finishedAt": row.get("finished_at"),
        "rounds": count_rounds(row["id"]),
    }


def load_rounds(match_id: str, user_id: str):
    get_match_or_404(match_id, user_id)
    response = (
        supabase.table("rounds")
        .select("*")
        .eq("match_id", match_id)
        .order("created_at", desc=False)
        .execute()
    )
    return [row.get("snapshot") or {} for row in (response.data or [])]


@app.on_event("startup")
def startup():
    # Supabase/PostgreSQL is initialized remotely; no local database setup is required.
    pass


@app.get("/")
def root():
    return {"status": "online", "message": "TFT Coach API", "version": app.version}


@app.get("/api/health")
def health():
    try:
        supabase.table("matches").select("id").limit(1).execute()
        db_status = "supabase-postgres"
        status = "healthy"
    except Exception as exc:
        db_status = "supabase-postgres-error"
        status = "unhealthy"
    return {"status": status, "database": db_status, "version": app.version}


@app.get("/api-info")
def api_info():
    return {
        "status": "online",
        "version": app.version,
        "endpoints": [
            "/api/health",
            "/api/matches",
            "/api/matches/{match_id}",
            "/api/matches/{match_id}/rounds",
            "/api/matches/{match_id}/finish",
            "/api/matches/{match_id}/review",
            "/api/matches/{match_id}/ai-advice",
            "/api/player/profile",
            "/api/player/analyze",
        ],
    }


@app.post("/api/matches")
def create_match(
    payload: MatchCreate,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    match_id = str(uuid.uuid4())
    started_at = utc_now()

    # Current Step 3 schema has no metadata column, so metadata is intentionally
    # not persisted yet. The frontend API shape remains unchanged.
    row = {
        "id": match_id,
        "user_id": user_id,
        "mode": payload.mode,
        "set_name": payload.set_name,
        "status": "active",
        "started_at": started_at,
    }

    try:
        response = supabase.table("matches").insert(row).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not create match: {exc}")

    created = response.data[0] if response.data else row
    return {
        "id": created["id"],
        "mode": created.get("mode"),
        "setName": created.get("set_name"),
        "status": created.get("status"),
        "startedAt": created.get("started_at"),
        "rounds": 0,
    }


@app.get("/api/matches")
def get_match_history(
    limit: int = Query(20, ge=1, le=100),
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    response = (
        supabase.table("matches")
        .select("*")
        .eq("user_id", user_id)
        .order("started_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"matches": [match_row(row) for row in (response.data or [])]}


@app.get("/api/matches/{match_id}")
def get_match(
    match_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    row = get_match_or_404(match_id, user_id)
    result = match_row(row)
    result["roundHistory"] = load_rounds(match_id, user_id)
    return result


@app.post("/api/matches/{match_id}/rounds")
def save_round(
    match_id: str,
    snapshot: RoundSnapshot,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    get_match_or_404(match_id, user_id)

    snapshot_data = snapshot.model_dump(by_alias=True, exclude_none=True)
    # Supabase rounds.id is UUID. The frontend may send a local UI id
    # such as "1790563504806-3-2", so never persist that value as the DB id.
    round_id = str(uuid.uuid4())
    saved_at = snapshot.savedAt or utc_now()

    existing = (
        supabase.table("rounds")
        .select("id")
        .eq("match_id", match_id)
        .eq("stage", snapshot.stage)
        .limit(1)
        .execute()
    )

    if existing.data:
        round_id = existing.data[0]["id"]
        update_row = {
            "stage": snapshot.stage,
            "round_type": snapshot.roundType,
            "result": snapshot.result,
            "hp": int(snapshot.hp),
            "gold": int(snapshot.gold),
            "level": int(snapshot.level),
            "xp": int(snapshot.xp),
            "streak": int(snapshot.streak),
            "snapshot": snapshot_data,
            "updated_at": saved_at,
        }
        supabase.table("rounds").update(update_row).eq("id", round_id).eq("match_id", match_id).execute()
    else:
        insert_row = {
            "id": round_id,
            "match_id": match_id,
            "stage": snapshot.stage,
            "round_type": snapshot.roundType,
            "result": snapshot.result,
            # Supabase schema uses integer columns for these TFT economy/level fields.
            "hp": int(snapshot.hp),
            "gold": int(snapshot.gold),
            "level": int(snapshot.level),
            "xp": int(snapshot.xp),
            "streak": int(snapshot.streak),
            "snapshot": snapshot_data,
        }
        supabase.table("rounds").insert(insert_row).execute()

    return {"id": round_id, "matchId": match_id, "stage": snapshot.stage, "savedAt": saved_at}


@app.post("/api/matches/{match_id}/finish")
def finish_match(
    match_id: str,
    payload: FinishPayload,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    get_match_or_404(match_id, user_id)
    finished_at = utc_now()

    supabase.table("matches").update({
        "status": "finished",
        "finished_at": finished_at,
    }).eq("id", match_id).eq("user_id", user_id).execute()

    review = build_review(match_id, user_id)
    return {"matchId": match_id, "status": "finished", "finishedAt": finished_at, "review": review}


def build_review(match_id: str, user_id: str):
    rounds = load_rounds(match_id, user_id)
    wins = sum(1 for r in rounds if r.get("result") == "win")
    losses = sum(1 for r in rounds if r.get("result") == "loss")
    hp_values = [float(r.get("hp", 0)) for r in rounds if r.get("hp") is not None]
    hp_delta = (hp_values[-1] - hp_values[0]) if len(hp_values) >= 2 else 0
    return {
        "summary": f"Đã phân tích {len(rounds)} round.",
        "rounds": len(rounds),
        "wins": wins,
        "losses": losses,
        "hpDelta": hp_delta,
        "highlights": [],
    }


@app.get("/api/matches/{match_id}/review")
def get_match_review(
    match_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    return build_review(match_id, user_id)


@app.get("/api/player/profile")
def get_player_profile(
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    # Fetch this authenticated user's matches first,
    # then aggregate only rounds belonging to those matches.
    matches_response = (
        supabase.table("matches")
        .select("id")
        .eq("user_id", user_id)
        .execute()
    )
    match_ids = [row["id"] for row in (matches_response.data or [])]

    if not match_ids:
        return {
            "matchesPlayed": 0,
            "roundsAnalyzed": 0,
            "winRate": None,
            "avgHpLoss": None,
        }

    rounds_response = (
        supabase.table("rounds")
        .select("result,hp,created_at")
        .in_("match_id", match_ids)
        .order("created_at", desc=False)
        .execute()
    )
    rounds = rounds_response.data or []

    total_matches = len(match_ids)
    total_rounds = len(rounds)
    wins = sum(1 for row in rounds if row.get("result") == "win")
    hp_values = [float(row.get("hp", 0)) for row in rounds]
    avg_hp_loss = 0
    if len(hp_values) >= 2:
        losses = [max(0, hp_values[i - 1] - hp_values[i]) for i in range(1, len(hp_values))]
        avg_hp_loss = round(sum(losses) / len(losses), 2) if losses else 0

    return {
        "matchesPlayed": total_matches,
        "roundsAnalyzed": total_rounds,
        "winRate": round((wins / total_rounds) * 100, 1) if total_rounds else None,
        "avgHpLoss": avg_hp_loss if total_rounds else None,
    }


@app.get("/api/player/analyze")
def analyze_player(
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    matches_response = (
        supabase.table("matches")
        .select("id")
        .eq("user_id", user_id)
        .execute()
    )
    match_ids = [row["id"] for row in (matches_response.data or [])]

    if not match_ids:
        return {"patterns": [], "roundsAnalyzed": 0}

    rounds_response = (
        supabase.table("rounds")
        .select("snapshot")
        .in_("match_id", match_ids)
        .order("created_at", desc=False)
        .execute()
    )
    data = [row.get("snapshot") or {} for row in (rounds_response.data or [])]

    patterns = []
    if data:
        low_hp = sum(1 for r in data if float(r.get("hp", 100)) <= 40)
        if low_hp >= 2:
            patterns.append({
                "title": "Low HP rounds",
                "detail": f"Có {low_hp} round được ghi nhận ở 40 HP hoặc thấp hơn.",
            })
        no_items = sum(1 for r in data if not r.get("selectedItems"))
        if no_items >= 2:
            patterns.append({
                "title": "Item tracking",
                "detail": f"Có {no_items} round chưa ghi nhận trang bị.",
            })

    return {"patterns": patterns, "roundsAnalyzed": len(data)}


@app.post("/api/matches/{match_id}/ai-advice")
def ai_advice(
    match_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
):
    user_id = current_user["id"]
    rounds = load_rounds(match_id, user_id)
    if not rounds:
        return {
            "title": "AI Coach",
            "advice": "Chưa có round nào được lưu để phân tích.",
            "provider": "local-rule-engine",
        }

    latest = rounds[-1]
    hp = float(latest.get("hp", 100))
    gold = float(latest.get("gold", 0))
    board = latest.get("board") or []

    if hp <= 35:
        advice = "Ưu tiên ổn định board vì HP hiện tại thấp; tránh giữ economy nếu board chưa đủ mạnh."
    elif gold >= 50:
        advice = "Bạn đang có economy cao; kiểm tra board và ngưỡng level trước khi tiếp tục tích vàng."
    elif not board:
        advice = "Chưa có board được ghi nhận; hãy nhập đội hình để Coach phân tích chính xác hơn."
    else:
        advice = "Tiếp tục theo dõi HP, economy và chất lượng board ở round kế tiếp."

    return {
        "title": "AI Coach",
        "advice": advice,
        "provider": "local-rule-engine",
    }
