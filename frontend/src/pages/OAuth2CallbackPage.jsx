import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { getToken, getStoredUser, persistAuth, clearAuth } from "../api/client.js";

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (token) {
      // Token received via URL parameter (backend redirects to frontend callback)
      try {
        const userParam = params.get("user");
        let userData = { jwtToken: token };
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
          } catch (e) {
            console.error("Failed to parse user data", e);
          }
        }
        
        persistAuth(userData);

        // Try to get stored user
        const user = getStoredUser();
        if (user) {
          // Redirect to dashboard page
          window.location.href = "/dashboard";
        } else {
          setStatus("success");
          setMessage("Signed in! Redirecting...");
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } catch (e) {
        setStatus("error");
        setMessage("Failed to process token");
      }
    } else if (error) {
      setStatus("error");
      setErrorCode(error);
      setMessage(errorDescription || `OAuth2 error: ${error}`);
    } else {
      // No token in URL - maybe backend returned JSON directly in popup
      // This page is for redirect flow; close if opened directly
      setStatus("error");
      setMessage("No token received. Please try login again.");
    }
  }, [location.search, navigate]);

  if (status === "loading") {
    return (
      <div className="auth-page" style={{ display: "grid", placeItems: "center" }}>
        <div className="auth-card" style={{ textAlign: "center", padding: 40 }}>
          <Loader2 className="spin" size={48} style={{ color: "var(--accent)", marginBottom: 16 }} />
          <h2 style={{ marginBottom: 8 }}>Completing Sign In</h2>
          <p style={{ color: "var(--text-secondary)" }}>Please wait while we finish authentication...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="auth-page" style={{ display: "grid", placeItems: "center" }}>
        <div className="auth-card" style={{ textAlign: "center", padding: 40 }}>
          <CheckCircle2 size={48} style={{ color: "var(--accent)", marginBottom: 16 }} />
          <h2 style={{ marginBottom: 8 }}>Welcome Back!</h2>
          <p style={{ color: "var(--text-secondary)" }}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ display: "grid", placeItems: "center" }}>
      <div className="auth-card" style={{ textAlign: "center", padding: 40 }}>
        <XCircle size={48} style={{ color: "var(--danger)", marginBottom: 16 }} />
        <h2 style={{ marginBottom: 8 }}>Sign In Failed</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>{message}</p>
        {errorCode && (
          <code style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 16 }}>
            Error: {errorCode}
          </code>
        )}
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          <AlertTriangle size={14} style={{ marginRight: 6 }} />
          Try Again
        </button>
      </div>
    </div>
  );
}