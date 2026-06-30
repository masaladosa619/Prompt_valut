import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  Heart,
  Star,
  Users,
  Globe,
  Lock,
  X,
  GitFork,
  Eye,
  Bell,
  User,
  Tag,
  XCircle,
  Check,
  Loader2,
  Copy,
} from "lucide-react";
import { fetchCommunityPrompts, createPrompt, deletePrompt } from "../api/client.js";
import DashboardLayout from "../components/DashboardLayout.jsx";
import "./CommunityPage.css";

// ── Seed Data ───────────────────────────────────────────────────────────
const seedPrompts = [
  {
    id: 1,
    title: "Code Review Assistant",
    content: "You are a senior software engineer reviewing a pull request. Focus on: correctness, readability, performance, security, and maintainability. Provide specific, actionable feedback with code examples where helpful. Be constructive but thorough.",
    model: "GPT-4",
    category: "coding",
    location: "github.com/microsoft/vscode",
    author: "Sarah Chen",
    authorInitial: "SC",
    rating: 5,
    date: "2025-03-15",
    isFavorite: true,
    visibility: "public",
    tags: ["code-review", "best-practices", "mentoring"],
    forks: 42,
    likes: 128,
  },
  {
    id: 2,
    title: "Technical Blog Post Writer",
    content: "Write a technical blog post explaining [TOPIC] for [AUDIENCE]. Structure: compelling intro, clear sections with headers, code examples with explanations, real-world analogies, and actionable takeaways. Tone: approachable expert. Length: 1500-2000 words.",
    model: "Claude 3.5 Sonnet",
    category: "writing",
    location: "anthropic.com/blog",
    author: "Marcus Johnson",
    authorInitial: "MJ",
    rating: 5,
    date: "2025-03-10",
    isFavorite: false,
    visibility: "public",
    tags: ["technical-writing", "content", "seo"],
    forks: 31,
    likes: 95,
  },
  {
    id: 3,
    title: "SQL Query Optimizer",
    content: "Analyze the following SQL query and suggest optimizations. Consider: index usage, join order, subquery flattening, partitioning, and statistics. Provide EXPLAIN analysis and rewritten query with comments explaining each optimization.",
    model: "GPT-4",
    category: "coding",
    location: "internal-tools",
    author: "Priya Patel",
    authorInitial: "PP",
    rating: 4,
    date: "2025-03-08",
    isFavorite: true,
    visibility: "friends",
    tags: ["sql", "performance", "database"],
    forks: 18,
    likes: 67,
  },
  {
    id: 4,
    title: "API Design Reviewer",
    content: "Review this API specification for REST best practices: resource naming, HTTP verbs, status codes, versioning, pagination, error handling, and OpenAPI compliance. Flag breaking changes and suggest improvements with examples.",
    model: "Claude 3 Opus",
    category: "coding",
    location: "api-docs.company.com",
    author: "Alex Rivera",
    authorInitial: "AR",
    rating: 5,
    date: "2025-03-05",
    isFavorite: false,
    visibility: "public",
    tags: ["api-design", "rest", "architecture"],
    forks: 27,
    likes: 89,
  },
  {
    id: 5,
    title: "Incident Response Playbook",
    content: "Create an incident response runbook for [SERVICE]. Include: severity definitions, escalation paths, diagnostic queries, common remediation steps, communication templates, and post-incident review checklist. Format as markdown with checkboxes.",
    model: "GPT-4o",
    category: "analysis",
    location: "pagerduty.com/docs",
    author: "Jordan Kim",
    authorInitial: "JK",
    rating: 4,
    date: "2025-03-01",
    isFavorite: false,
    visibility: "public",
    tags: ["sre", "incident-response", "runbook"],
    forks: 22,
    likes: 73,
  },
  {
    id: 6,
    title: "Recursive Prompt Engineering",
    content: "Meta-prompt: Given a task description, generate an optimal prompt for that task. Then critique your own prompt and improve it. Repeat 3 times. Output the final evolved prompt with reasoning for each iteration.",
    model: "Gemini 1.5 Pro",
    category: "prompt-engineering",
    location: "google.ai/gemini",
    author: "Taylor Brooks",
    authorInitial: "TB",
    rating: 5,
    date: "2025-02-28",
    isFavorite: true,
    visibility: "public",
    tags: ["meta-prompting", "optimization", "advanced"],
    forks: 56,
    likes: 154,
  },
  {
    id: 7,
    title: "Security Threat Modeling",
    content: "Perform a STRIDE threat analysis on the attached architecture diagram. Identify threats per component, assign risk ratings, and propose mitigations. Output as a structured table with columns: Component | Threat | STRIDE Category | Likelihood | Impact | Mitigation.",
    model: "Claude 3.5 Sonnet",
    category: "analysis",
    location: "owasp.org",
    author: "Ravi Singh",
    authorInitial: "RS",
    rating: 4,
    date: "2025-02-25",
    isFavorite: false,
    visibility: "friends",
    tags: ["security", "threat-modeling", "stride"],
    forks: 15,
    likes: 52,
  },
  {
    id: 8,
    title: "Legacy Code Modernizer",
    content: "Refactor this legacy [LANGUAGE] code to modern idioms. Preserve exact behavior. Apply: type hints, async/await, pattern matching, standard library upgrades, dependency injection, and comprehensive tests. Explain each change.",
    model: "GPT-4",
    category: "coding",
    location: "github.com/legacy-migration",
    author: "Emma Wilson",
    authorInitial: "EW",
    rating: 5,
    date: "2025-02-20",
    isFavorite: false,
    visibility: "private",
    tags: ["refactoring", "modernization", "testing"],
    forks: 8,
    likes: 34,
  },
  {
    id: 9,
    title: "Product Requirements Doc Generator",
    content: "Transform rough feature notes into a polished PRD. Sections: Problem Statement, User Stories, Success Metrics, Scope (In/Out), Technical Considerations, Risks, Timeline, Dependencies. Use clear language, bullet points, and tables where appropriate.",
    model: "Claude 3.5 Sonnet",
    category: "writing",
    location: "linear.app/templates",
    author: "Chris Park",
    authorInitial: "CP",
    rating: 4,
    date: "2025-02-18",
    isFavorite: true,
    visibility: "public",
    tags: ["product-management", "prd", "documentation"],
    forks: 38,
    likes: 112,
  },
  {
    id: 10,
    title: "Data Pipeline Architect",
    content: "Design an end-to-end data pipeline for [USE CASE]. Specify: ingestion method, storage format, processing framework, orchestration, monitoring, data quality checks, and cost optimization. Include architecture diagram description and tech stack justification.",
    model: "GPT-4o",
    category: "analysis",
    location: "databricks.com/solutions",
    author: "Lisa Zhang",
    authorInitial: "LZ",
    rating: 5,
    date: "2025-02-15",
    isFavorite: false,
    visibility: "public",
    tags: ["data-engineering", "pipeline", "architecture"],
    forks: 29,
    likes: 87,
  },
  {
    id: 11,
    title: "Accessibility Audit Checklist",
    content: "Audit this React component tree for WCAG 2.1 AA compliance. Check: semantic HTML, ARIA labels, focus management, color contrast, keyboard navigation, screen reader announcements, and responsive behavior. Output prioritized fix list with code snippets.",
    model: "Gemini 1.5 Pro",
    category: "analysis",
    location: "web.dev/accessibility",
    author: "Sam Taylor",
    authorInitial: "ST",
    rating: 4,
    date: "2025-02-12",
    isFavorite: false,
    visibility: "friends",
    tags: ["accessibility", "wcag", "react"],
    forks: 12,
    likes: 41,
  },
  {
    id: 12,
    title: "Regex Pattern Explainer",
    content: "Break down this complex regex into digestible parts. Explain each group, quantifier, assertion, and flag. Provide matching/non-matching examples. Visualize with regex railroad diagram description. Suggest simplifications if applicable.",
    model: "Claude 3 Opus",
    category: "coding",
    location: "regex101.com/library",
    author: "Nina Kowalski",
    authorInitial: "NK",
    rating: 3,
    date: "2025-02-10",
    isFavorite: false,
    visibility: "public",
    tags: ["regex", "parsing", "education"],
    forks: 7,
    likes: 29,
  },
];

// ── Category Definitions ────────────────────────────────────────────────
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "analysis", label: "Analysis" },
  { value: "prompt-engineering", label: "Prompt Engineering" },
];

const VISIBILITY_LABELS = {
  public: "Public",
  friends: "Friends",
  private: "Private",
};

const VISIBILITY_ICONS = {
  public: Globe,
  friends: Users,
  private: Lock,
};

// ── Main Component ──────────────────────────────────────────────────────
export default function CommunityPage({ user, addToast, setUser }) {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Load community prompts from backend on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchCommunityPrompts({ pageNo: 0, pageSize: 50 });
        const mappedData = (data.content || []).map(p => ({
          ...p,
          model: p.llmModel || "Unknown",
          visibility: p.publiclyShared ? "public" : "private",
          author: "Developer",
          location: "Vault",
          date: new Date().toISOString().split("T")[0],
          tags: []
        }));
        if (mounted) setPrompts(mappedData);
      } catch (err) {
        console.error("Failed to load community prompts:", err);
        // Fallback to seed data if backend fails
        if (mounted) setPrompts(seedPrompts);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showVerified, setShowVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    model: "GPT-4",
    category: "coding",
    visibility: "public",
    tags: "",
  });
  const [isForking, setIsForking] = useState(null);
  const [activeViewPrompt, setActiveViewPrompt] = useState(null);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCommunityPrompts({ pageNo: 0, pageSize: 50 });
      const pinnedIds = JSON.parse(localStorage.getItem("pv_pinned_prompts") || "[]");
      const mappedData = (data.content || []).map(p => ({
        ...p,
        model: p.llmModel || "Unknown",
        visibility: p.publiclyShared ? "public" : "private",
        author: "Developer",
        location: "Vault",
        date: new Date().toISOString().split("T")[0],
        tags: [],
        isFavorite: pinnedIds.includes(p.id)
      }));
      setPrompts(mappedData);
    } catch (err) {
      console.error("Failed to load community prompts:", err);
      const pinnedIds = JSON.parse(localStorage.getItem("pv_pinned_prompts") || "[]");
      const mappedData = seedPrompts.map(p => ({
        ...p,
        isFavorite: pinnedIds.includes(p.id)
      }));
      setPrompts(mappedData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt from the community?")) return;
    try {
      await deletePrompt(id);
      alert("Prompt successfully deleted from community.");
      loadPrompts();
    } catch (err) {
      alert("Failed to delete prompt: " + err.message);
    }
  };

  // ── Filter Logic ────────────────────────────────────────────────────
  const filteredPrompts = useMemo(() => {
    const filtered = prompts.filter((p) => {
      // Search
      if (search) {
        const query = search.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.model.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category
      if (category !== "all" && p.category !== category) return false;

      return true;
    });

    // Sort: Pinned (isFavorite) first
    return [...filtered].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });
  }, [prompts, search, category]);

  // ── Handlers ────────────────────────────────────────────────────────
  const toggleFavorite = (id) => {
    setPrompts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
      const pinnedIds = updated.filter(p => p.isFavorite).map(p => p.id);
      localStorage.setItem("pv_pinned_prompts", JSON.stringify(pinnedIds));
      return updated;
    });
  };

  const handleFork = async (prompt) => {
    setIsForking(prompt.id);
    try {
      await createPrompt({
        title: prompt.title + " (Forked)",
        content: prompt.content,
        llmModel: prompt.model,
        publiclyShared: false
      });
      // Reload from backend
      const data = await fetchCommunityPrompts({ pageNo: 0, pageSize: 50 });
      const pinnedIds = JSON.parse(localStorage.getItem("pv_pinned_prompts") || "[]");
      const mappedData = (data.content || []).map(p => ({
        ...p,
        model: p.llmModel || "Unknown",
        visibility: p.publiclyShared ? "public" : "private",
        author: "Developer",
        location: "Vault",
        date: new Date().toISOString().split("T")[0],
        tags: [],
        isFavorite: pinnedIds.includes(p.id)
      }));
      setPrompts(mappedData);

      if (addToast) {
        addToast("success", "Prompt Forked", `"${prompt.title}" has been added to your library.`);
      }
    } catch (err) {
      console.error("Failed to fork prompt:", err);
      if (addToast) {
        addToast("error", "Fork Failed", err.message || "Failed to fork prompt.");
      } else {
        alert("Failed to fork prompt: " + err.message);
      }
    } finally {
      setIsForking(null);
    }
  };

  const openModal = () => {
    setFormData({
      title: "",
      content: "",
      model: "GPT-4",
      category: "coding",
      visibility: "public",
      tags: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      await createPrompt({
        title: formData.title.trim(),
        content: formData.content.trim(),
        llmModel: formData.model,
        publiclyShared: formData.visibility === "public"
      });
      // Reload from backend
      const data = await fetchCommunityPrompts({ pageNo: 0, pageSize: 50 });
      const mappedData = (data.content || []).map(p => ({
        ...p,
        model: p.llmModel || "Unknown",
        visibility: p.publiclyShared ? "public" : "private",
        author: "Developer",
        location: "Vault",
        date: new Date().toISOString().split("T")[0],
        tags: []
      }));
      setPrompts(mappedData);
      closeModal();
    } catch (err) {
      console.error("Failed to publish prompt:", err);
      alert("Failed to publish prompt: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setDateFrom("");
    setDateTo("");
    setMinRating(0);
    setShowVerified(false);
  };

  const hasActiveFilters =
    search || category !== "all";

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <DashboardLayout user={user} setUser={setUser} hideTopbar={true}>
      {/* Page Content */}
      <div className="community-page">
        {/* Page Header */}
        <div className="community-page__header">
          <div>
            <h1 className="community-page__title">Community Prompts</h1>
            <p className="community-page__subtitle">
              Discover, fork, and share prompts from developers worldwide
            </p>
          </div>
          <button className="community-page__btn-create" onClick={openModal}>
            <Plus size={18} /> Create Prompt
          </button>
        </div>

        {/* Filter Panel */}
        <section className="filter-panel" aria-label="Filters">
          <div className="filter-panel__row">
            <div className="filter-search">
              <Search className="filter-search__icon" size={20} />
              <input
                type="text"
                className="filter-search__input"
                placeholder="Search by title, content, model, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search prompts"
              />
            </div>
            <div className="filter-tabs" role="tablist" aria-label="Category filter">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`filter-tab ${category === cat.value ? "filter-tab--active" : ""}`}
                  role="tab"
                  aria-selected={category === cat.value}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {hasActiveFilters && (
              <button className="filter-reset" onClick={clearFilters} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500" }}>
                <XCircle size={14} /> Reset filters
              </button>
            )}
          </div>
        </section>

        {/* Prompt Grid */}
        <section aria-label="Community prompts">
          {filteredPrompts.length > 0 ? (
            <div className="prompt-grid" role="list">
              {filteredPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onFavorite={toggleFavorite}
                  onFork={handleFork}
                  onView={setActiveViewPrompt}
                  onDelete={handleDelete}
                  isForking={isForking === prompt.id}
                  currentUser={user}
                />
              ))}
            </div>
          ) : (
            <div className="community-empty" role="status">
              <div className="community-empty__icon">
                <Search size={28} />
              </div>
              <h2 className="community-empty__title">No prompts found</h2>
              <p className="community-empty__text">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms."
                  : "Be the first to share a prompt with the community!"}
              </p>
              {!hasActiveFilters && (
                <button className="community-page__btn-create" onClick={openModal}>
                  <Plus size={18} /> Create First Prompt
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Create Prompt Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 id="modal-title" className="modal__title">Create New Prompt</h2>
              <button className="modal__close" onClick={closeModal} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal__body">
              <div className="modal__field">
                <label htmlFor="title" className="modal__label">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="modal__input"
                  placeholder="e.g., Code Review Assistant, SQL Optimizer..."
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal__field">
                <label htmlFor="content" className="modal__label">Prompt Content</label>
                <textarea
                  id="content"
                  name="content"
                  className="modal__textarea"
                  placeholder="Write your prompt here..."
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal__field">
                <label htmlFor="model" className="modal__label">Model</label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  className="modal__input"
                  placeholder="e.g. GPT-4o, Claude 3.5 Sonnet, Gemini"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal__field">
                <label htmlFor="category" className="modal__label">Category</label>
                <select
                  id="category"
                  name="category"
                  className="modal__select"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal__field">
                <label htmlFor="tags" className="modal__label">Tags (comma-separated)</label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  className="modal__input"
                  placeholder="e.g., refactoring, testing, code-review"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal__field">
                <label htmlFor="visibility" className="modal__label">Visibility</label>
                <select
                  id="visibility"
                  name="visibility"
                  className="modal__select"
                  value={formData.visibility}
                  onChange={handleInputChange}
                >
                  <option value="public">Public — Everyone can see and fork</option>
                  <option value="private">Private — Only you</option>
                </select>
              </div>
              <div className="modal__footer">
                <button type="button" className="modal__btn modal__btn--secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="modal__btn modal__btn--primary">
                  <Plus size={16} /> Publish Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check icon for checkbox - inline SVG */}
      <svg style={{ display: "none" }}>
        <symbol id="Check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </symbol>
      </svg>

      {/* View Prompt Modal */}
      {activeViewPrompt && (
        <PromptViewModal prompt={activeViewPrompt} onClose={() => setActiveViewPrompt(null)} />
      )}
    </DashboardLayout>
  );
}

// ── Prompt Card Component ─────────────────────────────────────────────
function PromptCard({ prompt, onFavorite, onFork, onView, onDelete, isForking, currentUser }) {
  const isOwner = currentUser && prompt.author === currentUser.username;
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");
  const VisibilityIcon = VISIBILITY_ICONS[prompt.visibility] || Globe;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <article className="prompt-card" role="listitem">
      <div className="prompt-card__header">
        <h3 className="prompt-card__title">{prompt.title}</h3>
        <button
          className={`prompt-card__favorite ${prompt.isFavorite ? "prompt-card__favorite--active" : ""}`}
          onClick={() => onFavorite(prompt.id)}
          aria-label={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={prompt.isFavorite}
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="prompt-card__meta">
        <div className="prompt-card__meta-item">
          <Tag size={16} />
          <span className="prompt-card__meta-text">{prompt.model}</span>
        </div>
        <div className="prompt-card__meta-item">
          <MapPin size={16} />
          <span className="prompt-card__meta-text">{prompt.location}</span>
        </div>
        <div className="prompt-card__meta-item">
          <User size={16} />
          <span className="prompt-card__meta-text">by {prompt.author}</span>
        </div>
      </div>

      <div className="prompt-card__tags">
        <span className="prompt-card__tag prompt-card__tag--model">{prompt.model}</span>
        {prompt.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="prompt-card__tag">{tag}</span>
        ))}
        {prompt.tags.length > 3 && (
          <span className="prompt-card__tag">+{prompt.tags.length - 3} more</span>
        )}
      </div>

      <div className="prompt-card__footer">
        <span className={`prompt-card__badge prompt-card__badge--${prompt.visibility}`}>
          <VisibilityIcon size={12} /> {VISIBILITY_LABELS[prompt.visibility]}
        </span>
        <div className="prompt-card__actions">
          {!isOwner && (
            <button
              className="prompt-card__action-btn prompt-card__action-btn--primary"
              onClick={() => onFork(prompt)}
              disabled={isForking}
              aria-label={`Fork "${prompt.title}" to your library`}
            >
              {isForking ? "Forked!" : <><GitFork size={14} /> Fork</>}
            </button>
          )}
          <button
            className="prompt-card__action-btn"
            onClick={() => onView(prompt)}
            aria-label={`View "${prompt.title}"`}
          >
            <Eye size={14} /> View
          </button>
          <button
            className="prompt-card__action-btn"
            onClick={() => {
              navigator.clipboard.writeText(prompt.content);
              alert(`"${prompt.title}" copied to clipboard!`);
            }}
            aria-label={`Copy "${prompt.title}"`}
          >
            <Copy size={14} /> Copy
          </button>
          {isAdmin && (
            <button
              className="prompt-card__action-btn prompt-card__action-btn--danger"
              onClick={() => onDelete(prompt.id)}
              aria-label={`Delete "${prompt.title}"`}
              style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}
            >
              <XCircle size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function PromptViewModal({ prompt, onClose }) {
  if (!prompt) return null;

  const VisibilityIcon = VISIBILITY_ICONS[prompt.visibility] || Globe;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="view-modal-title">
      <div className="modal modal--large" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#ffffff" }}>
        <div className="modal__header" style={{ borderBottom: "1px solid #e5e7eb" }}>
          <h2 id="view-modal-title" className="modal__title" style={{ color: "#111827", fontWeight: "700" }}>Prompt Details</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal" style={{ color: "#9ca3af" }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal__body prompt-view" style={{ padding: "24px" }}>
          <div className="prompt-view__header" style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="prompt-view__title" style={{ color: "#1f2937", fontSize: "1.4rem", fontWeight: "700", margin: "0" }}>{prompt.title}</h3>
            <span className={`prompt-view__badge prompt-view__badge--${prompt.visibility}`} style={{ color: "#4b5563" }}>
              <VisibilityIcon size={12} /> {VISIBILITY_LABELS[prompt.visibility]}
            </span>
          </div>

          <div className="prompt-view__meta" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", color: "#4b5563", marginBottom: "20px" }}>
            <div className="prompt-view__meta-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Tag size={16} style={{ color: "#6b7280" }} />
              <span>Model: <strong style={{ color: "#111827" }}>{prompt.model}</strong></span>
            </div>
            <div className="prompt-view__meta-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} style={{ color: "#6b7280" }} />
              <span>Location: <strong style={{ color: "#111827" }}>{prompt.location}</strong></span>
            </div>
            <div className="prompt-view__meta-item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} style={{ color: "#6b7280" }} />
              <span>Author: <strong style={{ color: "#111827" }}>{prompt.author}</strong></span>
            </div>
          </div>

          <div className="prompt-view__tags" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
            {(prompt.tags || []).map((tag) => (
              <span key={tag} className="prompt-view__tag" style={{ backgroundColor: "#f3f4f6", color: "#374151", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{tag}</span>
            ))}
          </div>

          <div className="prompt-view__content" style={{ marginTop: "24px" }}>
            <h4 style={{ color: "#374151", marginBottom: "12px", fontSize: "1.1rem", fontWeight: "600" }}>Prompt Content</h4>
            <div style={{ position: "relative" }}>
              <pre
                className="prompt-view__code"
                style={{
                  background: "#0c0c0d",
                  color: "#4be1af",
                  padding: "20px",
                  paddingRight: "50px",
                  borderRadius: "10px",
                  overflowX: "auto",
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  border: "1px solid rgba(75, 225, 175, 0.15)",
                  whiteSpace: "pre-wrap",
                  maxHeight: "350px",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)",
                  margin: "0"
                }}
              >
                {prompt.content}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(prompt.content);
                  alert(`"${prompt.title}" content copied to clipboard!`);
                }}
                title="Copy content"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#9ca3af",
                  padding: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(75, 225, 175, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(75, 225, 175, 0.3)";
                  e.currentTarget.style.color = "#4be1af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="modal__footer" style={{ borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="modal__btn modal__btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}