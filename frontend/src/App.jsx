import { useMemo, useState } from "react";
import {
  Bot,
  Database,
  KeyRound,
  Library,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2
} from "lucide-react";

const emptyForm = {
  title: "",
  llmModel: "gemini-1.5-flash",
  content: ""
};

const starterPrompts = [
  {
    id: 1,
    title: "Support Ticket Summarizer",
    llmModel: "gemini-1.5-flash",
    content:
      "Analyze the customer ticket and return a concise summary, root cause, urgency level, and suggested next action."
  },
  {
    id: 2,
    title: "Code Review Assistant",
    llmModel: "gemini-1.5-pro",
    content:
      "Review the provided code for bugs, security risks, readability issues, and missing tests. Prioritize concrete findings."
  }
];

function App() {
  const [prompts, setPrompts] = useState(starterPrompts);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedPrompt = useMemo(
    () => prompts.find((prompt) => prompt.id === selectedId) ?? prompts[0],
    [prompts, selectedId]
  );

  const filteredPrompts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return prompts;
    }

    return prompts.filter((prompt) =>
      [prompt.title, prompt.content, prompt.llmModel]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search))
    );
  }, [prompts, query]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim() || !form.llmModel.trim()) {
      setError("Title, model, aur prompt content required hain.");
      return;
    }

    setError("");
    setSaving(true);

    const created = {
      id: Date.now(),
      title: form.title.trim(),
      llmModel: form.llmModel.trim(),
      content: form.content.trim()
    };

    setPrompts((current) => [created, ...current]);
    setSelectedId(created.id);
    setForm(emptyForm);
    setSaving(false);
  }

  function handleDelete(id) {
    setError("");
    setPrompts((current) => current.filter((prompt) => prompt.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1>Prompt Vault</h1>
            <p>Secure LLM middleware</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          <a className="nav-item active" href="#library">
            <Library size={18} />
            Library
          </a>
          <a className="nav-item" href="#gateway">
            <Bot size={18} />
            AI Gateway
          </a>
          <a className="nav-item" href="#storage">
            <Database size={18} />
            PostgreSQL
          </a>
          <a className="nav-item" href="#security">
            <KeyRound size={18} />
            Security
          </a>
        </nav>

        <div className="phase-panel">
          <span>Phase 1</span>
          <strong>Core Engine</strong>
          <p>REST APIs, JPA entity, repository, service, controller.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Enterprise prompt operations</p>
            <h2>Manage reusable prompts before security and gateway layers.</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => setPrompts(starterPrompts)}
            title="Reset local prompts"
          >
            <RefreshCw size={18} />
          </button>
        </header>

        {error ? <div className="notice">{error}</div> : null}

        <div className="dashboard-grid">
          <section className="panel composer" aria-labelledby="create-prompt-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Create</p>
                <h3 id="create-prompt-title">New Prompt</h3>
              </div>
              <Plus size={20} />
            </div>

            <form onSubmit={handleSubmit} className="prompt-form">
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="Support ticket summarizer"
                />
              </label>

              <label>
                LLM Model
                <input
                  name="llmModel"
                  value={form.llmModel}
                  onChange={updateForm}
                  placeholder="gemini-1.5-flash"
                />
              </label>

              <label>
                Prompt Content
                <textarea
                  name="content"
                  value={form.content}
                  onChange={updateForm}
                  placeholder="Analyze the following customer ticket and return a concise summary..."
                  rows={9}
                />
              </label>

              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
                Save Prompt
              </button>
            </form>
          </section>

          <section className="panel library-panel" id="library" aria-labelledby="prompt-library-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Vault</p>
                <h3 id="prompt-library-title">Prompt Library</h3>
              </div>
              <span className="count-pill">{prompts.length}</span>
            </div>

            <div className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompts"
              />
            </div>

            <div className="prompt-list">
              {filteredPrompts.length ? (
                filteredPrompts.map((prompt) => (
                  <button
                    className={`prompt-row ${selectedPrompt?.id === prompt.id ? "selected" : ""}`}
                    key={prompt.id}
                    type="button"
                    onClick={() => setSelectedId(prompt.id)}
                  >
                    <span>
                      <strong>{prompt.title}</strong>
                      <small>{prompt.llmModel}</small>
                    </span>
                    <em>#{prompt.id}</em>
                  </button>
                ))
              ) : (
                <div className="empty-state">No prompts found.</div>
              )}
            </div>
          </section>

          <section className="panel detail-panel" aria-labelledby="prompt-detail-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Selected</p>
                <h3 id="prompt-detail-title">{selectedPrompt?.title ?? "No prompt selected"}</h3>
              </div>
              {selectedPrompt ? (
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleDelete(selectedPrompt.id)}
                  title="Delete prompt"
                >
                  <Trash2 size={17} />
                </button>
              ) : null}
            </div>

            {selectedPrompt ? (
              <article className="prompt-detail">
                <div className="metadata">
                  <span>ID #{selectedPrompt.id}</span>
                  <span>{selectedPrompt.llmModel}</span>
                </div>
                <pre>{selectedPrompt.content}</pre>
              </article>
            ) : (
              <div className="empty-state">Create or select a prompt.</div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
