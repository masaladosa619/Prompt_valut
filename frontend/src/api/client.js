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
 * OAuth2 Login via Popup
 * Opens OAuth2 authorization in a popup and attempts to extract JWT from the JSON response.
 * Note: Backend returns JSON directly, so this is a best-effort attempt.
 */
export function loginWithOAuth2(provider) {
  const OAUTH2_BASE = "http://localhost:8080/oauth2/authorization";
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    `${OAUTH2_BASE}/${provider}`,
    "oauth2-popup",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popup) {
    throw new Error("Popup blocked. Please allow popups for this site.");
  }

  return new Promise((resolve, reject) => {
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        clearInterval(pollContent);
        reject(new Error("OAuth2 window closed by user"));
      }
    }, 500);

    // Poll popup for JSON content (works if same-origin or if we can read it)
    const pollContent = setInterval(() => {
      try {
        // This will fail cross-origin, but works if backend redirects to frontend callback
        const doc = popup.document;
        if (doc && doc.body) {
          const text = doc.body.innerText || doc.body.textContent;
          if (text && text.includes("jwtToken")) {
            clearInterval(checkClosed);
            clearInterval(pollContent);
            popup.close();
            try {
              const data = JSON.parse(text);
              if (data.jwtToken) {
                persistAuth(data);
                resolve(data);
              } else {
                reject(new Error("No token in OAuth2 response"));
              }
            } catch (e) {
              reject(new Error("Failed to parse OAuth2 response"));
            }
          }
        }
      } catch (e) {
        // Cross-origin: can't read popup content
        // This is expected for localhost:8080 -> localhost:5173
      }
    }, 1000);

    // Fallback: listen for postMessage from a frontend callback page
    // (would need backend to redirect to frontend callback URL)
    const messageHandler = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "OAUTH2_SUCCESS" && event.data.token) {
        clearInterval(checkClosed);
        clearInterval(pollContent);
        window.removeEventListener("message", messageHandler);
        const data = { jwtToken: event.data.token, ...event.data.user };
        if (data.jwtToken) {
          persistAuth(data);
          resolve(data);
        }
      } else if (event.data?.type === "OAUTH2_ERROR") {
        clearInterval(checkClosed);
        clearInterval(pollContent);
        window.removeEventListener("message", messageHandler);
        reject(new Error(event.data.error || "OAuth2 failed"));
      }
    };
    window.addEventListener("message", messageHandler);
  });
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
    if (res.status === 401) {
      const isAuthRoute = res.url && (res.url.includes("/auth/login") || res.url.includes("/auth/register"));
      if (!isAuthRoute) {
        clearAuth();
        window.location.href = "/?expired=true"; // Redirect to landing page with expired query param
        return null;
      }
    }
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
  let finalSortBy = sortBy;
  let finalSortDir = sortDir;

  // If sort state has comma format like "id,desc", split it
  if (sortBy && sortBy.includes(",")) {
    const parts = sortBy.split(",");
    finalSortBy = parts[0];
    finalSortDir = parts[1];
  }

  const params = new URLSearchParams({
    pageNo: String(pageNo),
    pageSize: String(pageSize),
    sortBy: finalSortBy,
    sortDir: finalSortDir,
  });

  const res = await fetch(`${BASE}/prompts?${params}`, {
    headers: headers(true)
  });
  return handleResponse(res);
}

export async function searchPrompts({ title = "", model = "" } = {}) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (model) params.set("model", model);
  const res = await fetch(`${BASE}/prompts/search?${params}`, {
    headers: headers(true)
  });
  return handleResponse(res);
}

/* ── Prompts (Community/Public) ─────────────────────────────── */

// Fetch community (public) prompts with pagination & sorting
export async function fetchCommunityPrompts({ pageNo = 0, pageSize = 5, sortBy = "id", sortDir = "asc" } = {}) {
  let finalSortBy = sortBy;
  let finalSortDir = sortDir;

  if (sortBy && sortBy.includes(",")) {
    const parts = sortBy.split(",");
    finalSortBy = parts[0];
    finalSortDir = parts[1];
  }

  const params = new URLSearchParams({
    pageNo: String(pageNo),
    pageSize: String(pageSize),
    sortBy: finalSortBy,
    sortDir: finalSortDir,
  });

  const res = await fetch(`${BASE}/prompts/community?${params}`, {
    headers: headers(true)
  });
  return handleResponse(res);
}

// Search community prompts
export async function searchCommunityPrompts({ title = "", model = "" } = {}) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (model) params.set("model", model);

  const res = await fetch(`${BASE}/prompts/community/search?${params}`, {
    headers: headers(true)
  });
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
