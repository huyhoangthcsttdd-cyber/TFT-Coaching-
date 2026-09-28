import { useEffect, useState } from "react";
import { Brain, Database, RefreshCw, Sparkles, Target, TrendingUp } from "lucide-react";
import {
  getHealth,
  getMatchHistory,
  getMatchReview,
  getPlayerAnalysis,
  getPlayerProfile,
  getAIAdvice,
  finishMatch,
} from "./api/coachApi";
import "./PersonalCoach.css";

function PersonalCoach({ matchId = null, roundHistory = [], onFinishMatch }) {
  const [online, setOnline] = useState(false);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [review, setReview] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    setBusy(true);
    setMessage("");
    try {
      const [health, matches, player, playerAnalysis] = await Promise.all([
        getHealth(), getMatchHistory(20), getPlayerProfile(), getPlayerAnalysis(),
      ]);
      setOnline(Boolean(health?.status));
      setHistory(matches?.matches || []);
      setProfile(player);
      setAnalysis(playerAnalysis);
      if (matchId) {
        try { setReview(await getMatchReview(matchId)); } catch {}
      }
      setMessage("Đã cập nhật dữ liệu Personal Coach.");
    } catch (error) {
      setOnline(false);
      setMessage("Backend chưa kết nối. Match Coach vẫn hoạt động bình thường ở chế độ local.");
    } finally { setBusy(false); }
  };

  useEffect(() => { refresh(); }, [matchId, roundHistory.length]);

  const handleFinish = async () => {
    if (!matchId) return;
    setBusy(true);
    try {
      const result = await finishMatch(matchId, { localRoundCount: roundHistory.length });
      setReview(result.review || null);
      setMessage("Đã kết thúc trận và tạo Post-Match Review.");
      onFinishMatch?.(result);
      await refresh();
    } catch { setMessage("Không thể kết thúc trận. Kiểm tra Backend."); }
    finally { setBusy(false); }
  };

  const handleAI = async () => {
    if (!matchId) return;
    setBusy(true);
    try {
      setAdvice(await getAIAdvice(matchId));
      setMessage("Đã tạo AI Coach advice.");
    } catch { setMessage("Chưa tạo được AI advice. Có thể dùng Local Coach nếu chưa cấu hình API key."); }
    finally { setBusy(false); }
  };

  return (
    <section className="personal-coach-panel">
      <div className="personal-coach-header">
        <div><span>PHASE 2 · PERSONAL COACH</span><h3>Hồ sơ & huấn luyện cá nhân</h3></div>
        <div className={`personal-coach-status ${online ? "online" : "offline"}`}>
          {online ? "Backend Online" : "Local Mode"}
        </div>
      </div>
      <div className="personal-coach-body">
        <div className="personal-coach-actions">
          <button onClick={refresh} disabled={busy}><RefreshCw size={14}/> Cập nhật</button>
          {matchId && <button onClick={handleFinish} disabled={busy}>Kết thúc trận</button>}
          {matchId && <button className="primary" onClick={handleAI} disabled={busy}><Sparkles size={14}/> AI Coach</button>}
        </div>
        {message && <div className="personal-coach-empty">{message}</div>}
        <div className="personal-coach-grid" style={{marginTop:16}}>
          <div className="personal-coach-metric"><span>Trận đã lưu</span><strong>{profile?.matchesPlayed ?? history.length}</strong></div>
          <div className="personal-coach-metric"><span>Round đã phân tích</span><strong>{profile?.roundsAnalyzed ?? 0}</strong></div>
          <div className="personal-coach-metric"><span>Win rate</span><strong>{profile?.winRate != null ? `${profile.winRate}%` : "—"}</strong></div>
          <div className="personal-coach-metric"><span>HP / round</span><strong>{profile?.avgHpLoss != null ? profile.avgHpLoss : "—"}</strong></div>
        </div>
        {analysis?.patterns?.length > 0 && <div className="personal-coach-section"><h4><Brain size={15}/> Player Patterns</h4><div className="personal-coach-list">{analysis.patterns.map((p,i)=><div className="personal-coach-item" key={i}><strong>{p.title}</strong><p>{p.detail}</p></div>)}</div></div>}
        {review && <div className="personal-coach-section"><h4><Target size={15}/> Post-Match Review</h4><div className="personal-coach-list"><div className="personal-coach-item"><strong>{review.summary}</strong><p>Round: {review.rounds} · Win: {review.wins} · Loss: {review.losses} · HP thay đổi: {review.hpDelta}</p></div>{review.highlights?.map((h,i)=><div className="personal-coach-item" key={i}><strong>{h.title}</strong><p>{h.detail}</p></div>)}</div></div>}
        {advice && <div className="personal-coach-section"><h4><Sparkles size={15}/> AI Coach</h4><div className="personal-coach-advice"><strong>{advice.title || "Khuyến nghị"}</strong><p>{advice.advice}</p>{advice.provider && <small>{advice.provider}</small>}</div></div>}
        {history.length > 0 && <div className="personal-coach-section"><h4><Database size={15}/> Match History</h4><div className="personal-coach-list">{history.slice(0,8).map((m)=><div className="personal-coach-item" key={m.id}><strong>{m.status === "finished" ? "Đã kết thúc" : "Đang chơi"} · {m.rounds} rounds</strong><p>{m.startedAt ? new Date(m.startedAt).toLocaleString("vi-VN") : ""}</p></div>)}</div></div>}
      </div>
    </section>
  );
}
export default PersonalCoach;
