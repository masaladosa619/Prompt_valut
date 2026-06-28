import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Clock,
  Database,
  Edit3,
  Eye,
  KeyRound,
  Library,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  clearAuth,
  createPrompt,
  deletePrompt,
  fetchPrompts,
  getToken,
  searchPrompts,
  updatePrompt,
} from "../api/client.js";

const emptyForm = { title: "", llmModel: "", content: "" };

import DashboardLayout from '../components/DashboardLayout.jsx';

export default function DashboardPage({ user, setUser, addToast }) {
  const navigate = useNavigate();
  const isAuth = !!user && !!getToken();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  /* ── Nav & Page ──────────────────────────────────────────── */
  const [activePage, setActivePage] = useState("library");

  /* ── Prompts ─────────────────────────────────────────────── */
  const [prompts, setPrompts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ── Pagination ──────────────────────────────────────────── */
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* ── Search ──────────────────────────────────────────────── */
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef(null);

  /* ── Editor ──────────────────────────────────────────────── */
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);

  /* ── Derived ─────────────────────────────────────────────── */
  const selectedPrompt = useMemo(
    () => prompts.find((p) => p.id === selectedId) ?? null,
    [prompts, selectedId]
  );

  /* ── Auth Guard ──────────────────────────────────────────── */
  function requireAuth(action) {
    if (!isAuth) {
      addToast("warning", "Authentication Required", `Sign in to ${action}.`);
      navigate("/login");
      return false;
    }
    return true;
  }

  /* ── Load ────────────────────────────────────────────────── */
  const loadPrompts = useCallback(
    async (page = pageNo, size = pageSize) => {
      setLoading(true);
      try {
        const data = await fetchPrompts({ pageNo: page, pageSize: size });
        setPrompts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPageNo(data.pageable?.pageNumber ?? page);
      } catch (err) {
        addToast("error", "Failed to load prompts", err.message);
      } finally {
        setLoading(false);
      }
    },
    [pageNo, pageSize, addToast]
  );

  useEffect(() => {
    loadPrompts(0, pageSize);
  }, [pageSize]);

  /* ── Debounced Search ────────────────────────────────────── */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      loadPrompts(0, pageSize);
      return;
    }
    setIsSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchPrompts({ title: searchQuery.trim() });
        setPrompts(results || []);
        setTotalPages(1);
        setTotalElements(results?.length || 0);
        setPageNo(0);
      } catch (err) {
        addToast("error", "Search Failed", err.message);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  /* ── Form ────────────────────────────────────────────────── */
  function updateForm(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFormErrors((fe) => ({ ...fe, [name]: "" }));
  }

  function validateForm() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title required hai.";
    if (!form.llmModel.trim()) errs.llmModel = "Model required hai.";
    if (!form.content.trim()) errs.content = "Content required hai.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function startCreate() {
    if (!requireAuth("create prompts")) return;
    setMode("edit");
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  }

  function startEdit(prompt) {
    if (!requireAuth("edit prompts")) return;
    setMode("edit");
    setEditingId(prompt.id);
    setForm({ title: prompt.title, llmModel: prompt.llmModel, content: prompt.content });
    setFormErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!requireAuth("save prompts")) return;
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        llmModel: form.llmModel.trim(),
        content: form.content.trim(),
      };
      if (editingId) {
        const updated = await updatePrompt(editingId, payload);
        setPrompts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        setSelectedId(updated.id);
        addToast("success", "Prompt Updated", `"${updated.title}" saved.`);
      } else {
        const created = await createPrompt(payload);
        addToast("success", "Prompt Created", `"${created.title}" added.`);
        await loadPrompts(0, pageSize);
        setSelectedId(created.id);
      }
      setMode("view");
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      const msg =
        err.status === 401 ? "Session expired. Sign in again." :
        err.status === 403 ? "403 Forbidden: No permission." :
        err.message;
      addToast("error", "Save Failed", msg);
      if (err.status === 401) { clearAuth(); setUser(null); navigate("/login"); }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!requireAuth("delete prompts")) return;
    if (!isAdmin) {
      addToast("warning", "Permission Denied", "Only ROLE_ADMIN can delete.");
      return;
    }
    try {
      await deletePrompt(id);
      addToast("success", "Prompt Deleted", "Removed from the vault.");
      if (selectedId === id) { setSelectedId(null); setMode("view"); }
      await loadPrompts(pageNo, pageSize);
    } catch (err) {
      const msg =
        err.status === 401 ? "Session expired." :
        err.status === 403 ? "403 Forbidden: No permission to delete." :
        err.message;
      addToast("error", "Delete Failed", msg);
      if (err.status === 401) { clearAuth(); setUser(null); navigate("/login"); }
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast("info", "Copied!", "Prompt content copied to clipboard.");
    });
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
    addToast("info", "Signed Out", "See you next time!");
    navigate("/");
  }

  /* ── Pagination ──────────────────────────────────────────── */
  function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    setPageNo(page);
    loadPrompts(page, pageSize);
  }

  function renderPageNumbers() {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, pageNo - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
    for (let i = start; i < end; i++) {
      pages.push(
        <button key={i} className={pageNo === i ? "active" : ""} onClick={() => goToPage(i)}>
          {i + 1}
        </button>
      );
    }
    return pages;
  }

  /* ═══════════════════════════════════════════════════════════
     Render
     ═══════════════════════════════════════════════════════════ */

  return (
    <DashboardLayout user={user}>
      {/* ── Sidebar ──────────────────────────────────────── */}
      
      {/* ── Main ─────────────────────────────────────────── */}
      <main className="dash-main">
        {activePage === "library" ? (
          <>
            
            <div className="dash-grid">
              {/* ── Left: Prompt Library ───────────────── */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">Vault</p>
                    <h3>Prompt Library</h3>
                  </div>
                  <span className="count-pill">{totalElements}</span>
                </div>

                <div className="search-box">
                  <Search size={16} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts by title..."
                  />
                  {(isSearching || (searchQuery && loading)) && <Loader2 className="spin" size={15} />}
                </div>

                <div className="prompt-list">
                  {loading && prompts.length === 0 ? (
                    <>
                      <div className="skeleton" style={{ height: 56 }} />
                      <div className="skeleton" style={{ height: 56 }} />
                      <div className="skeleton" style={{ height: 56 }} />
                    </>
                  ) : prompts.length > 0 ? (
                    prompts.map((p) => (
                      <button
                        className={`prompt-row ${selectedId === p.id ? "selected" : ""}`}
                        key={p.id}
                        onClick={() => { setSelectedId(p.id); setMode("view"); }}
                      >
                        <div className="prompt-row-info">
                          <span className="prompt-row-title">{p.title}</span>
                          <span className="model-badge">{p.llmModel}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="empty-state">
                      {searchQuery ? "No prompts match your search." : "No prompts yet. Create one!"}
                    </div>
                  )}
                </div>

                {!searchQuery.trim() && totalPages > 0 && (
                  <div className="pagination">
                    <button disabled={pageNo === 0} onClick={() => goToPage(pageNo - 1)}>
                      <ChevronLeft size={14} />
                    </button>
                    {renderPageNumbers()}
                    <button disabled={pageNo >= totalPages - 1} onClick={() => goToPage(pageNo + 1)}>
                      <ChevronRight size={14} />
                    </button>
                    <select
                      className="page-size-select"
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPageNo(0); }}
                    >
                      <option value={3}>3 / page</option>
                      <option value={5}>5 / page</option>
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                    </select>
                  </div>
                )}
              </div>

              {/* ── Right: Detail / Editor ─────────────── */}
              <div className="card" style={{ minHeight: 420 }}>
                <div className="card-header">
                  <div>
                    <p className="eyebrow">
                      {mode === "edit" ? (editingId ? "Editing" : "Creating") : "Details"}
                    </p>
                    <h3>
                      {mode === "edit"
                        ? editingId ? "Edit Prompt" : "New Prompt"
                        : selectedPrompt?.title ?? "Select a prompt"}
                    </h3>
                  </div>
                  {selectedPrompt && mode === "view" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-icon" onClick={() => startEdit(selectedPrompt)} title="Edit">
                        {isAuth ? <Edit3 size={16} /> : <Lock size={16} />}
                      </button>
                      {isAdmin && (
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(selectedPrompt.id)}
                          title="Delete"
                          style={{ color: "#fca5a5", borderColor: "rgba(239,68,68,0.2)" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mode-tabs">
                  <button className={`mode-tab ${mode === "view" ? "active" : ""}`} onClick={() => setMode("view")}>
                    <Eye size={14} /> View
                  </button>
                  <button
                    className={`mode-tab ${mode === "edit" ? "active" : ""}`}
                    onClick={() => {
                      if (mode !== "edit") {
                        if (selectedPrompt) startEdit(selectedPrompt);
                        else startCreate();
                      }
                    }}
                  >
                    <Edit3 size={14} /> {editingId ? "Edit" : "Create"}
                  </button>
                </div>

                {mode === "view" ? (
                  selectedPrompt ? (
                    <>
                      <div className="prompt-detail">
                        <div className="prompt-meta">
                          <span className="meta-tag">ID #{selectedPrompt.id}</span>
                          <span className="model-badge">{selectedPrompt.llmModel}</span>
                        </div>
                        <pre className="prompt-content-block">{selectedPrompt.content}</pre>
                      </div>
                      <div className="action-bar">
                        <button className="btn btn-outline btn-sm" onClick={() => handleCopy(selectedPrompt.content)}>
                          {copied ? <Check size={14} /> : <ClipboardCopy size={14} />}
                          {copied ? "Copied!" : "Copy Content"}
                        </button>
                        {!isAuth && (
                          <Link to="/login" className="lock-badge">
                            <Lock size={12} /> Sign in to edit
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">Select a prompt from the library or create a new one.</div>
                  )
                ) : (
                  <form onSubmit={handleSubmit} className="prompt-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input name="title" value={form.title} onChange={updateForm} placeholder="e.g. Support Ticket Summarizer" />
                      {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                    </div>
                    <div className="form-group">
                      <label>LLM Model</label>
                      <input name="llmModel" value={form.llmModel} onChange={updateForm} placeholder="e.g. GPT-4, gemini-1.5-flash" />
                      {formErrors.llmModel && <span className="form-error">{formErrors.llmModel}</span>}
                    </div>
                    <div className="form-group">
                      <label>Prompt Content</label>
                      <textarea name="content" value={form.content} onChange={updateForm} placeholder="Write your system prompt here..." rows={7} />
                      {formErrors.content && <span className="form-error">{formErrors.content}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1 }}>
                        {saving ? <Loader2 className="spin" size={17} /> : <Plus size={17} />}
                        {editingId ? "Update Prompt" : "Save Prompt"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => { setMode("view"); setEditingId(null); setForm(emptyForm); setFormErrors({}); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="placeholder-page">
            <div className="placeholder-icon">
              {activePage === "gateway" && <Bot size={32} />}
              {activePage === "ratelimit" && <Clock size={32} />}
              {activePage === "security" && <Shield size={32} />}
              {activePage === "audit" && <Database size={32} />}
            </div>
            <h3>
              {activePage === "gateway" ? "AI Gateway" :
               activePage === "ratelimit" ? "Rate Limiting" :
               activePage === "security" ? "Security & RBAC" : "Audit Logs"}
            </h3>
            <p>Phase 6 Gateway Integration Pending — This feature is under active development and will be available in a future sprint.</p>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
