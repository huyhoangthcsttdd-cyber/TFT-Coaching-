import AuthPage from "./auth/AuthPage";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Swords,
  BarChart3,
  Brain,
  Database,
  Settings,
  Search,
} from "lucide-react";

import MatchCoach from "./MatchCoach";
import { getHealth } from "./api/coachApi";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [page, setPage] = useState("dashboard");

  // =========================================================
  // SUPABASE AUTH SESSION
  // =========================================================

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const handleLogout = async () => {
  await supabase.auth.signOut();
};

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =========================================================
  // BACKEND HEALTH
  // =========================================================

  useEffect(() => {
    getHealth()
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Offline"));
  }, []);

  // =========================================================
  // AUTH LOADING
  // =========================================================

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7fb",
          color: "#172033",
          fontSize: "15px",
          fontWeight: 600,
        }}
      >
        Đang kiểm tra tài khoản...
      </div>
    );
  }

  // =========================================================
  // AUTH PAGE
  // =========================================================

  if (!session) {
    return <AuthPage />;
  }

  // =========================================================
  // MAIN APP
  // =========================================================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">T</div>
          <span>TFT Coach</span>
        </div>

        <nav className="menu">

          <div
            className={`menu-item ${
              page === "dashboard" ? "active" : ""
            }`}
            onClick={() => setPage("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <div
            className={`menu-item ${
              page === "coach" ? "active" : ""
            }`}
            onClick={() => setPage("coach")}
          >
            <Swords size={18} />
            Match Coach
          </div>

          <div className="menu-item">
            <BarChart3 size={18} />
            Meta
          </div>

          <div className="menu-item">
            <Brain size={18} />
            Analysis
          </div>

          <div className="menu-item">
            <Database size={18} />
            Data
          </div>

        </nav>

        <div className="sidebar-bottom">

  <div className="menu-item">
    <Settings size={18} />
    Settings
  </div>

  <div
    className="menu-item"
    onClick={handleLogout}
    style={{ cursor: "pointer" }}
  >
    Đăng xuất
  </div>

  <div className="status">
    <span className="status-dot"></span>
    {backendStatus}
  </div>

</div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <>

            <header className="topbar">

              <div>
                <h1>TFT Coach</h1>
                <p>Set 18 · Patch 18.3</p>
              </div>

              <div className="search">

                <Search size={18} />

                <input
                  placeholder="Search champion, trait, item..."
                />

              </div>

            </header>

            <section className="hero">

              <div>

                <div className="badge">
                  SET 18
                </div>

                <h2>
                  Your Personal TFT Coach
                </h2>

                <p>
                  Analyse your games, understand your decisions
                  and improve your fundamentals.
                </p>

              </div>

            </section>

            <section className="grid">

              <div className="card">

                <div className="card-icon">
                  <Swords />
                </div>

                <h3>
                  Match Coach
                </h3>

                <p>
                  Review your board, economy,
                  items and augment decisions.
                </p>

                <button
                  onClick={() => setPage("coach")}
                >
                  Open Match Coach
                </button>

              </div>

              <div className="card">

                <div className="card-icon">
                  <BarChart3 />
                </div>

                <h3>
                  Meta Explorer
                </h3>

                <p>
                  Explore current compositions,
                  traits and item statistics.
                </p>

                <button>
                  Explore Meta
                </button>

              </div>

              <div className="card">

                <div className="card-icon">
                  <Brain />
                </div>

                <h3>
                  Game Analysis
                </h3>

                <p>
                  Find mistakes and recurring
                  patterns across your games.
                </p>

                <button>
                  Analyse Games
                </button>

              </div>

            </section>

          </>
        )}

        {/* MATCH COACH */}

        {page === "coach" && (
          <MatchCoach />
        )}

      </main>

    </div>
  );
}

export default App;