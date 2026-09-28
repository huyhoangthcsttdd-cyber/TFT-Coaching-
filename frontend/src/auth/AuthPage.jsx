import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (mode === "login") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          throw signInError;
        }

        setMessage("Đăng nhập thành công.");
        return;
      }

      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        setMessage("Đăng ký thành công.");
      } else {
        setMessage(
          "Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản."
        );
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>TFT COACH</div>

        <h1 style={styles.title}>
          {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
        </h1>

        <p style={styles.subtitle}>
          {mode === "login"
            ? "Đăng nhập để lưu và phân tích các trận TFT của bạn."
            : "Tạo tài khoản để lưu dữ liệu TFT Coach riêng cho bạn."}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />

          <label style={styles.label}>Mật khẩu</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu"
            minLength={6}
            required
            style={styles.input}
          />

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Đang xử lý..."
              : mode === "login"
                ? "Đăng nhập"
                : "Đăng ký"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
            setError("");
          }}
          style={styles.switchButton}
        >
          {mode === "login"
            ? "Chưa có tài khoản? Đăng ký"
            : "Đã có tài khoản? Đăng nhập"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#f5f7fb",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    background: "#ffffff",
    border: "1px solid #e5e9f2",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(23, 32, 51, 0.08)",
  },

  badge: {
    display: "inline-block",
    marginBottom: "12px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "28px",
  },

  subtitle: {
    margin: "0 0 24px",
    color: "#697386",
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: 600,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "16px",
    padding: "12px 14px",
    border: "1px solid #d9deea",
    borderRadius: "9px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background: "#172033",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },

  switchButton: {
    width: "100%",
    marginTop: "16px",
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#4759c7",
    cursor: "pointer",
    fontSize: "14px",
  },

  error: {
    marginBottom: "14px",
    padding: "10px",
    borderRadius: "8px",
    background: "#fff1f1",
    color: "#c62828",
    fontSize: "13px",
  },

  message: {
    marginBottom: "14px",
    padding: "10px",
    borderRadius: "8px",
    background: "#eefaf2",
    color: "#217a42",
    fontSize: "13px",
  },
};