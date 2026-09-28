import { supabase } from "../lib/supabase";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* =========================================================
   AUTHENTICATED REQUEST
   ---------------------------------------------------------
   Lấy Supabase access token của user đang đăng nhập
   và gửi JWT sang FastAPI.
   ========================================================= */

async function request(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error ${response.status}`);
  }

  return response.status === 204
    ? null
    : response.json();
}

/* =========================================================
   MATCH
   ========================================================= */

export const createMatch = async (payload = {}) =>
  request("/api/matches", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const saveRound = async (matchId, snapshot) =>
  request(`/api/matches/${matchId}/rounds`, {
    method: "POST",
    body: JSON.stringify(snapshot),
  });

export const finishMatch = async (matchId, payload = {}) =>
  request(`/api/matches/${matchId}/finish`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMatch = async (matchId) =>
  request(`/api/matches/${matchId}`);

/* =========================================================
   REVIEW / HISTORY
   ========================================================= */

export const getMatchReview = async (matchId) =>
  request(`/api/matches/${matchId}/review`);

export const getMatchHistory = async (limit = 20) =>
  request(`/api/matches?limit=${limit}`);

/* =========================================================
   PLAYER
   ========================================================= */

export const getPlayerProfile = async () =>
  request("/api/player/profile");

export const getPlayerAnalysis = async () =>
  request("/api/player/analyze");

/* =========================================================
   AI COACH
   ========================================================= */

export const getAIAdvice = async (matchId) =>
  request(`/api/matches/${matchId}/ai-advice`, {
    method: "POST",
    body: JSON.stringify({}),
  });

/* =========================================================
   HEALTH
   ========================================================= */

export const getHealth = async () =>
  request("/api/health");