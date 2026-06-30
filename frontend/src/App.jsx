import { useCallback, useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Menu,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

import { getStoredUser } from "./api/client.js";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import ClickSpark from "./components/ClickSpark.jsx";

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Toast System
   ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

let toastSeq = 0;

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type} ${t.exiting ? "toast-exit" : ""}`}>
          <span className="toast-icon">
            {t.type === "success" && <CheckCircle2 size={18} />}
            {t.type === "error" && <XCircle size={18} />}
            {t.type === "warning" && <AlertTriangle size={18} />}
            {t.type === "info" && <Info size={18} />}
          </span>
          <div className="toast-body">
            <strong>{t.title}</strong>
            {t.message && <p>{t.message}</p>}
          </div>
          <button className="toast-dismiss" onClick={() => onDismiss(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  const addToast = useCallback(
    (type, title, message = "") => {
      const id = ++toastSeq;
      setToasts(prev => [...prev, { id, type, title, message, exiting: false }]);
      setTimeout(() => dismiss(id), 4500);
      return id;
    },
    [dismiss]
  );

  return { toasts, addToast, dismiss };
}

/* ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Navbar (for landing & auth pages)
   ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

function Navbar({ user }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAuth = location.pathname === "/login";

  // Don't show navbar on dashboard
  if (!isLanding && !isAuth) return null;

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Prompt Vault
      </Link>

      <nav className="navbar-links">
        <a href="/#features" className="hover-lift">Features</a>
        <a href="/#how-it-works" className="hover-lift">How It Works</a>
        <a href="/#faq" className="hover-lift">FAQ</a>
      </nav>

      <div className="navbar-actions">
        {user ? (
          <Link to="/dashboard" className="btn btn-primary btn-sm ripple">Dashboard</Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm ripple">Sign In</Link>
            <Link to="/login?mode=register" className="btn btn-outline btn-sm ripple">Get Started</Link>
          </>
        )}
      </div>
    </header>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
   App Root
   ══════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const { toasts, addToast, dismiss } = useToasts();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "true") {
      addToast("warning", "Session Expired", "Session over as Jwt token has expired");
      // Remove "?expired=true" from the URL bar without reloading the page
      const cleanUrl = window.location.pathname + window.location.search.replace(/[?&]expired=true/, '').replace(/^&/, '?');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [addToast]);

  return (
    <ClickSpark
      sparkColor="#4be1af"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={400}
    >
      <BrowserRouter>
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onAuth={setUser} addToast={addToast} />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="/community" element={<CommunityPage user={user} addToast={addToast} setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={<DashboardPage user={user} setUser={setUser} addToast={addToast} initialPage="library" />}
          />
          <Route
            path="/gateway"
            element={<DashboardPage user={user} setUser={setUser} addToast={addToast} initialPage="gateway" />}
          />
          <Route
            path="/workflows"
            element={<DashboardPage user={user} setUser={setUser} addToast={addToast} initialPage="workflows" />}
          />
        </Routes>
      </BrowserRouter>
    </ClickSpark>
  );
}