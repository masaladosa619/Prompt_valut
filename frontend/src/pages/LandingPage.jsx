import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  ChevronDown,
  Code2,
  Database,
  KeyRound,
  Layers,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import ShinyText from "../components/ShinyText";
import LightRays from "../components/LightRays";
import TextType from "../components/TextType";
import LogoLoop from "../components/LogoLoop";
import BorderGlow from "../components/BorderGlow";
import CurvedLoop from "../components/CurvedLoop";
// Tech logos
import SpringLogo from "../../assests/logos/spring-boot.svg";
import PostgresLogo from "../../assests/logos/postgresql.svg";
import VercelLogo from "../../assests/logos/vercel-svgrepo-com.svg";
import JwtLogo from "../../assests/logos/jwt.svg";
import ReactLogo from "../../assests/logos/reactjs-svgrepo-com.svg";
import ViteLogo from "../../assests/logos/vite-svgrepo-com.svg";
import "./LandingPage.css";

/* ── Marquee Data ──────────────────────────────────────────────────── */

const marqueeRows = [
  [
    { text: "Summarize this support ticket concisely", dot: "green" },
    { text: "Generate a code review checklist for PRs", dot: "red" },
    { text: "Write a system prompt for customer onboarding", dot: "orange" },
    { text: "Create a SQL query optimizer template", dot: "blue" },
    { text: "Build an incident response playbook", dot: "purple" },
    { text: "Design a data extraction pipeline prompt", dot: "cyan" },
  ],
  [
    { text: "Translate technical docs to user-friendly language", dot: "orange" },
    { text: "Create an API documentation generator prompt", dot: "green" },
    { text: "Write a security audit checklist template", dot: "red" },
    { text: "Generate test cases from requirements", dot: "yellow" },
    { text: "Build a log analysis and alerting prompt", dot: "purple" },
    { text: "Design a multi-step reasoning chain", dot: "pink" },
  ],
  [
    { text: "Create a prompt for automated code migration", dot: "red" },
    { text: "Build a customer sentiment analysis template", dot: "green" },
    { text: "Write a deployment rollback decision prompt", dot: "orange" },
    { text: "Generate infrastructure cost optimization report", dot: "blue" },
    { text: "Design a compliance checking workflow", dot: "yellow" },
    { text: "Create a knowledge base Q&A prompt", dot: "cyan" },
  ],
];

/* ── FAQ Data ──────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "What is Prompt Vault?",
    a: "Prompt Vault is an enterprise-grade prompt management gateway built with Spring Boot 3.x. It provides centralized prompt storage, version control, role-based access, and API-first management for LLM operations.",
  },
  {
    q: "Is Prompt Vault open source?",
    a: "The core engine is open source and built as a learning project for mastering Spring Boot backend development, including JPA, Spring Security, JWT auth, and RESTful API design patterns.",
  },
  {
    q: "Which LLM models does Prompt Vault support?",
    a: "Prompt Vault is model-agnostic. You can store and manage prompts for any LLM — GPT-4, Gemini, Claude, Llama, Mistral, and more. The gateway layer routes prompts to the appropriate model endpoint.",
  },
  {
    q: "How does authentication work?",
    a: "Prompt Vault uses JWT (JSON Web Token) based authentication. Users register and login to receive a Bearer token, which is required for all write operations (create, update, delete prompts).",
  },
  {
    q: "What roles are supported?",
    a: "Currently, ROLE_DEVELOPER and ROLE_ADMIN are supported. Developers can create and edit prompts, while Admins additionally have permission to delete prompts and manage configurations.",
  },
  {
    q: "Does it support pagination and search?",
    a: "Yes. The API supports Spring Data pagination with configurable page size, sorting by any field, and full-text search by title and model. The frontend dynamically maps the Spring Page object.",
  },
  {
    q: "What tech stack is used?",
    a: "Backend: Spring Boot 3.x, Spring Security, Spring Data JPA, PostgreSQL, JWT. Frontend: React (Vite), Lucide Icons, vanilla CSS. The architecture follows clean layered patterns with DTOs, services, and controllers.",
  },
  {
    q: "How do I get started?",
    a: "Clone the repository, configure your PostgreSQL database in application.properties, run the Spring Boot backend, then start the Vite dev server for the frontend. Register an account and start creating prompts!",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   Landing Page Component
   ═══════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="landing-page">
  <div className="light-rays-wrapper" style={{ width: '100%', height: '600px', position: 'absolute', top: 72, left: 0, zIndex: 0, pointerEvents: 'none' }}>
    <LightRays
      raysOrigin="top-center"
      raysColor="#00ffff"
      raysSpeed={1.5}
      lightSpread={0.8}
      rayLength={1.2}
      followMouse={true}
      mouseInfluence={0.1}
      noiseAmount={0.1}
      distortion={0.05}
      className="custom-rays"
    />
  </div>
      <section className="hero" style={{ position: 'relative', zIndex: 1 }}>
        <ShinyText text="Prompt Vault" className="large-shiny" />
        <p className="hero-subtitle">
          Enterprise Prompt Gateway &amp; Management System for modern LLM operations.
        </p>

        {/* Live Demo Cards */}
        <div className="hero-demo">
          <div className="demo-section-label"><span className="dot" />
            Active Prompts (2)
          </div>

          <div className="demo-card">
            <span className="severity-badge gpt4">GPT-4</span>
            <div className="demo-card-content">
              <h4>Support Ticket Summarizer</h4>
              <div className="demo-card-meta">
                <span>enterprise-ops</span>
                <span>·</span>
                <span>2m ago</span>
                <span className="status">✦ Production ready</span>
              </div>
            </div>
            <span className="demo-card-arrow"><ArrowRight size={16} /></span>
          </div>

          <div className="demo-section-label orange"><span className="dot" />
            Recently Created (1)
          </div>

          <div className="demo-card">
            <span className="severity-badge gemini">Gemini</span>
            <div className="demo-card-content">
              <h4>Code Review Assistant</h4>
              <div className="demo-card-meta">
                <span>dev-tools</span>
                <span>·</span>
                <span>5h ago</span>
                <span className="status">✦ Under review</span>
              </div>
            </div>
            <span className="demo-card-arrow"><ArrowRight size={16} /></span>
          </div>

        </div>
          <div className="hero-cta" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/login" className="btn">
                        <span className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#4be1af" }} />Login
            <ArrowRight size={16} />
          </Link>
          <Link to="/signup" className="btn">
                        <span className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#4be1af" }} />Sign Up
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Quick Nav ───────────────────── */}

      {/* ── Tech Stack Scroller ────────────────────── */}
      <div className="built-with-wrapper">
  <p className="built-with" style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-secondary)", textAlign: "center" }}>Built with</p>
  <div className="logo-row">
    <div className="logo-item"><img src={SpringLogo} alt="Spring Boot" className="tech-logo" /><span className="logo-text">Spring Boot</span></div>
    <div className="logo-item"><img src={PostgresLogo} alt="PostgreSQL" className="tech-logo" /><span className="logo-text">PostgreSQL</span></div>
    <div className="logo-item"><img src={VercelLogo} alt="Vercel" className="tech-logo" /><span className="logo-text">Vercel</span></div>
    <div className="logo-item"><img src={JwtLogo} alt="JWT" className="tech-logo" /><span className="logo-text">JWT</span></div>
    <div className="logo-item"><img src={ReactLogo} alt="React" className="tech-logo" /><span className="logo-text">React</span></div>
    <div className="logo-item"><img src={ViteLogo} alt="Vite" className="tech-logo" /><span className="logo-text">Vite</span></div>
  </div>
</div>

      <LogoLoop
        logos={[
          { src: SpringLogo, alt: "Spring Boot", href: "https://spring.io/projects/spring-boot" },
          { src: PostgresLogo, alt: "PostgreSQL", href: "https://postgresql.org" },
          { src: VercelLogo, alt: "Vercel", href: "https://vercel.com" },
          { src: JwtLogo, alt: "JWT", href: "https://jwt.io" },
          { src: ReactLogo, alt: "React", href: "https://react.dev" },
          { src: ViteLogo, alt: "Vite", href: "https://vitejs.dev" }
        ]}
        speed={80}
        direction="left"
        logoHeight={48}
        gap={40}
        fadeOut
        scaleOnHover
        ariaLabel="Technology partners"
      />

      {/* ── Challenge / Marquee ───────────────────────────── */}
      <section className="marquee-section">
        <div className="marquee-header">
          <div style={{ display: "inline-flex" }}></div>
          <TextType as="h2" text={["Prompt management is a mess"]} style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "20px 0 16px" }} />
          <p style={{ fontSize: 16, color: "#a1a1aa", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Teams scatter prompts across Notion docs, Slack threads, and local files. 
            Prompt Vault gives you a single source of truth with versioning, search, and access control.
          </p>
        </div>

        {marqueeRows.map((row, i) => (
          <div className="marquee-row" key={i}>
            <div className="marquee-track">
              {[...row, ...row].map((pill, j) => (
                <span className="marquee-pill" key={j}>
                                    <span className={`dot ${pill.dot}`} />{pill.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── How It Works (Steps) ──────────────────────────── */}
      <section className="section section-center" id="how-it-works">
        <TextType as="h2" id="prompt-stack" text={["Prompt Vault fits into your stack"]} />
        <p className="section-desc">
          From prompt creation to production deployment — Prompt Vault manages the entire lifecycle with security, 
          versioning, and team collaboration built in.
        </p>

        <div className="steps-grid">
          <BorderGlow
            edgeSensitivity={25}
            glowColor="160 80 70"
            backgroundColor="rgba(14, 14, 18, 0.82)"
            borderRadius={14}
            glowRadius={30}
            glowIntensity={1.2}
            coneSpread={20}
            colors={['#4be1af', '#38bdf8', '#818cf8']}
          >
            <div className="step-card">
              <span className="step-number">Step 01</span>
              <div className="step-icon"><Code2 size={22} /></div>
              <h4>Create</h4>
              <p>Write and store reusable prompt templates for any LLM model. Add metadata, tags, and model targets.</p>
            </div>
          </BorderGlow>

          <BorderGlow
            edgeSensitivity={25}
            glowColor="160 80 70"
            backgroundColor="rgba(14, 14, 18, 0.82)"
            borderRadius={14}
            glowRadius={30}
            glowIntensity={1.2}
            coneSpread={20}
            colors={['#4be1af', '#818cf8', '#f472b6']}
          >
            <div className="step-card highlighted">
              <span className="step-number">Step 02</span>
              <div className="step-icon"><Lock size={22} /></div>
              <h4>Secure</h4>
              <ul>
                <li>JWT-based authentication</li>
                <li>Role-based access control</li>
                <li>Protected write operations</li>
              </ul>
            </div>
          </BorderGlow>

          <BorderGlow
            edgeSensitivity={25}
            glowColor="200 80 70"
            backgroundColor="rgba(14, 14, 18, 0.82)"
            borderRadius={14}
            glowRadius={30}
            glowIntensity={1.2}
            coneSpread={20}
            colors={['#38bdf8', '#4be1af', '#c084fc']}
          >
            <div className="step-card">
              <span className="step-number">Step 03</span>
              <div className="step-icon"><Search size={22} /></div>
              <h4>Discover</h4>
              <ul>
                <li>Full-text search by title</li>
                <li>Filter by LLM model</li>
                <li>Paginated browsing</li>
              </ul>
            </div>
          </BorderGlow>

          <BorderGlow
            edgeSensitivity={25}
            glowColor="270 70 70"
            backgroundColor="rgba(14, 14, 18, 0.82)"
            borderRadius={14}
            glowRadius={30}
            glowIntensity={1.2}
            coneSpread={20}
            colors={['#818cf8', '#f472b6', '#4be1af']}
          >
            <div className="step-card">
              <span className="step-number">Step 04</span>
              <div className="step-icon"><Zap size={22} /></div>
              <h4>Deploy</h4>
              <p>Route prompts through the API gateway to your LLM endpoints. Monitor usage and track performance.</p>
            </div>
          </BorderGlow>
        </div>
        <p className="section-quote">
          Most teams have great LLM capabilities but no standardized prompt management. Between writing a prompt 
          and deploying it, there's a gap of ad-hoc copy-pasting. That's where Prompt Vault lives.
        </p>
      </section>


      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="section section-center">
        <div id="faq"><CurvedLoop marqueeText="Frequently Asked Questions" /></div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={i}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            Prompt Vault
          </div>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Sign In</Link>
            <a href="#faq">FAQ</a>
          </div>
          <p className="footer-copy">© 2026 Prompt Vault · Built with Spring Boot &amp; React</p>
        </div>
      </footer>
    </div>
  );
}
