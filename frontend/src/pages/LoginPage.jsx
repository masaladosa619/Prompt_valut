import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Eye, EyeOff, Github, Chrome } from "lucide-react";
import "./LoginPage.css";
import { login, persistAuth, register } from "../api/client.js";

const OAUTH2_BASE = "https://promptvalut-production.up.railway.app/oauth2/authorization";

export default function LoginPage({ onAuth, addToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Read mode from URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get("mode");
    if (urlMode === "register") setMode("register");
  }, [location.search]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState("ROLE_DEVELOPER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Email and password are both required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await register({ username: username.trim(), password, roles });
        addToast("success", "Account Created!", "Please sign in with your credentials.");
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

  function handleOAuth2(provider) {
    // Redirect to backend OAuth2 endpoint
    // Backend will complete OAuth2 and redirect back to frontend /oauth2/callback?token=...
    window.location.href = `${OAUTH2_BASE}/${provider}`;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">


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

        {/* OAuth buttons - work for BOTH login & signup */}
        <div className="oauth-divider">
          <span>or continue with</span>
        </div>
        <div className="oauth-buttons">
          <a
            className="btn btn-oauth btn-google"
            href={`${OAUTH2_BASE}/google`}
          >
            <Chrome size={18} />
            Google
          </a>
          <a
            className="btn btn-oauth btn-github"
            href={`${OAUTH2_BASE}/github`}
          >
            <Github size={18} />
            GitHub
          </a>
        </div>

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
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>



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