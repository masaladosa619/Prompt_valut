import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { login, persistAuth, register } from "../api/client.js";

export default function LoginPage({ onAuth, addToast }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("ROLE_DEVELOPER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Email aur password dono required hain.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await register({ username: username.trim(), password, roles });
        addToast("success", "Account Created!", "Ab sign in karo with your credentials.");
        setMode("login");
        setPassword("");
      } else {
        const data = await login({ username: username.trim(), password });
        persistAuth(data);
        onAuth({ id: data.id, username: data.username, roles: data.roles });
        addToast("success", "Welcome Back!", `Signed in as ${data.username}`);
        navigate("/dashboard");
      }
    } catch (err) {
      const msg =
        err.status === 401
          ? "Invalid credentials. Check email/password."
          : err.status === 403
            ? "403 Forbidden: Access denied."
            : err.message || "Authentication failed.";
      setError(msg);
      addToast("error", "Authentication Failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: "rgba(75, 225, 175, 0.1)",
              border: "1px solid rgba(75, 225, 175, 0.25)",
              color: "#4be1af",
              margin: "0 auto 16px",
            }}
          >
            <ShieldCheck size={26} />
          </div>
        </div>

        <h2>{mode === "login" ? "Sign in to Prompt Vault" : "Create your account"}</h2>
        <p className="auth-subtitle">
          {mode === "login" ? (
            <>
              Or{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("register"); setError(""); }}>
                create a new account
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); setError(""); }}>
                Sign in
              </a>
            </>
          )}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="developer@promptvault.io"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="auth-role">Role</label>
              <select id="auth-role" value={roles} onChange={(e) => setRoles(e.target.value)}>
                <option value="ROLE_DEVELOPER">Developer</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading && <Loader2 className="spin" size={18} />}
            {mode === "login" ? "Sign in" : "Create Account"}
          </button>
        </form>

        <div className="auth-back">
          <Link to="/">
            <ArrowLeft size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
