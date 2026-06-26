/* ═══════════════════════════════════════════════════════════════
   Prompt Vault — API Client (Fetch-based)
   ═══════════════════════════════════════════════════════════════ */

const BASE = "http://localhost:8080/api";

/**
 * Read JWT token from localStorage.
 */
export function getToken() {
  return localStorage.getItem("pv_token");
}

/**
 * Read stored user object { id, username, roles }.
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem("pv_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist auth data after login.
 */
export function persistAuth(loginResponse) {
  localStorage.setItem("pv_token", loginResponse.jwtToken);
  localStorage.setItem(
    "pv_user",
    JSON.stringify({
      id: loginResponse.id,
      username: loginResponse.username,
      roles: loginResponse.roles,
    })
  );
}

/**
 * Clear auth data on logout.
 */
export function clearAuth() {
  localStorage.removeItem("pv_token");
  localStorage.removeItem("pv_user");
}

/**
 * Helper: build headers (optionally with JWT).
 */
function headers(authenticated = false) {
  const h = { "Content-Type": "application/json" };
  if (authenticated) {
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

/**
 * Helper: handle non-ok responses and throw structured errors.
 */
async function handleResponse(res) {
  if (res.status === 204) return null;

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error ||
      (typeof body === "string" ? body : `HTTP ${res.status}`);
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}

/* ── Auth ─────────────────────────────────────────────────── */

export async function register(payload) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function login(payload) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/* ── Prompts (Public) ────────────────────────────────────── */

export async function fetchPrompts({ pageNo = 0, pageSize = 5, sortBy = "id", sortDir = "asc" } = {}) {
  const params = new URLSearchParams({
    pageNo: String(pageNo),
    pageSize: String(pageSize),
    sortBy,
    sortDir,
  });
  const res = await fetch(`${BASE}/prompts?${params}`);
  return handleResponse(res);
}

export async function searchPrompts({ title = "", model = "" } = {}) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (model) params.set("model", model);
  const res = await fetch(`${BASE}/prompts/search?${params}`);
  return handleResponse(res);
}

/* ── Prompts (Secured) ───────────────────────────────────── */

export async function createPrompt(payload) {
  const res = await fetch(`${BASE}/prompts`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePrompt(id, payload) {
  const res = await fetch(`${BASE}/prompts/${id}`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deletePrompt(id) {
  const res = await fetch(`${BASE}/prompts/${id}`, {
    method: "DELETE",
    headers: headers(true),
  });
  return handleResponse(res);
}
