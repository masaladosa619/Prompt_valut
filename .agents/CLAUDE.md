# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Prompt Vault** - A full-stack prompt management application with:
- **Backend**: Spring Boot 3.5.15 (Java 21) with PostgreSQL, JPA, Spring Security, JWT auth, OAuth2 (Google/GitHub)
- **Frontend**: React 19 + Vite 7 + React Router 7, GSAP/GSAP-based animations, React 19

---

## Commands

### Backend (Maven)
```bash
cd /home/masaladosa/demo
./mvnw spring-boot:run          # Run backend on :8080
./mvnw test                       # Run tests
./mvnw clean package              # Build JAR
```

### Frontend (Vite + React)
```bash
cd /home/masaladosa/demo/frontend
npm run dev       # Dev server on :5173
npm run build     # Production build to /dist
npm run preview   # Preview production build
```

---

## Architecture

### Backend Structure (Spring Boot)
```
src/main/java/com/Prompt_lib/demo/
├── Controller/           # REST endpoints
│   ├── PromptController.java       # /api/prompts CRUD + search
│   └── AuthController.java         # /api/auth register, login
├── Service/              # Business logic
│   ├── PromptService.java          # CRUD + search, user-scoped queries
│   └── AuthService.java            # Register, login, OAuth2 handling, JWT
├── Repository/           # JPA repositories
│   ├── PromptRepo.java             # User-scoped search queries
│   └── UserRepository.java
├── Entity/               # JPA entities
│   ├── PromptEntity.java           # title, content, llmModel, isPublic, user_id
│   └── UserEntity.java             # username, password, roles (comma-separated)
├── Dto/                  # Request/Response DTOs
├── Mapper/               # ModelMapper-based DTO↔Entity mapping
├── Security/             # Spring Security config
│   ├── SecurityConfig.java         # SecurityFilterChain, JWT filter, OAuth2
│   ├── JwtFilter.java              # JWT token filter
│   ├── JwtUtil.java                # JWT generation/validation
│   ├── CustomerDetailService.java  # UserDetailsService
│   └── Oauth2Handler.java          # OAuth2 success handler → redirects to frontend
└── Exception/            # Custom exceptions + GlobalExceptionHandler
```

### Key Backend Patterns
- **User-scoped queries**: All `PromptRepo` queries scope by `UserEntity` (user sees only their prompts)
- **DTO pattern**: `PromptRequestDto` (input) → `PromptEntity` → `PromptResponseDto` (output) via `PromptMapper` (ModelMapper)
- **Auth**: JWT (HS256, `jwt.secretKey` from env) + OAuth2 (Google/GitHub) with redirect to frontend callback
- **Passwords**: BCrypt via `PasswordEncoder`
- **DB**: PostgreSQL, Hibernate `ddl-auto=update`, credentials via env vars (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `jwt_secret_key`, `github_client_id`, `github_client_secret`)

### Frontend Structure (React + Vite)
```
frontend/src/
├── api/client.js                    # Fetch wrapper, JWT handling, OAuth2 popup
├── components/                      # ~20 animated UI components (GSAP, OGL)
├── pages/
│   ├── LandingPage.jsx              # Public landing page
│   ├── LoginPage.jsx                # Email/password + OAuth2 buttons
│   ├── DashboardPage.jsx            # Protected dashboard (library, gateway, workflows)
│   └── OAuth2CallbackPage.jsx       # Receives OAuth2 redirect with JWT
├── styles.css / tokens.css          # Design tokens, global styles
└── App.jsx                          # Router, auth state, toast system
```

### Frontend Auth Flow
1. **Email/password**: POST `/api/auth/login` → JWT in localStorage (`pv_token`, `pv_user`)
2. **OAuth2**: Popup → `/oauth2/authorization/{google|github}` → backend redirects to `http://localhost:5173/oauth2/callback?token=...` → `OAuth2CallbackPage` stores token, closes popup

---

## Key Configuration

| File | Purpose |
|------|---------|
| `pom.xml` | Maven deps: Spring Boot 3.5, JPA, Security, OAuth2, JWT (JJWT), PostgreSQL, Lombok, ModelMapper |
| `application.properties` | DB config (env vars), JWT secret, OAuth2 client IDs/secrets |
| `frontend/vite.config.js` | Vite config, port 5173 |
| `.env` (not committed) | Required env vars for backend |

### Required Environment Variables
```bash
DB_URL=jdbc:postgresql://localhost:5432/promptvault
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
jwt_secret_key=your-256-bit-secret
github_client_id=xxx
github_client_secret=xxx
# Google OAuth2 credentials in application.properties
```

---

## Development Notes

### Running Locally
1. Start PostgreSQL with the configured database
2. Set environment variables (or `.env` with `spring-dotenv`)
3. `./mvnw spring-boot:run` (backend on :8080)
4. `cd frontend && npm run dev` (frontend on :5173)

### Testing Backend Endpoints
Use Postman/curl with `Authorization: Bearer <jwt>` header for secured endpoints:
- `POST /api/auth/register` - `{username, password}`
- `POST /api/auth/login` - `{username, password}` → returns `{jwtToken, id, username, roles}`
- `GET /api/prompts` - paginated, sorted (requires auth)
- `POST /api/prompts` - create prompt (requires auth)
- `GET /api/prompts/search?title=&model=` - user-scoped search

### Frontend Animation Stack
- **GSAP** + ScrollTrigger/ScrollToPlugin for scroll animations
- **OGL** (WebGL) for WebGL backgrounds (DotField, LightRays, etc.)
- **Motion** (Framer Motion) for React animations
- **Lucide React** for icons

---

## Important Patterns

1. **User isolation**: Every prompt query in `PromptService`/`PromptRepo` filters by `UserEntity` from `SecurityContextHolder`
2. **OAuth2 redirect**: Backend `Oauth2Handler` redirects to `http://localhost:5173/oauth2/callback?token=...`, frontend `OAuth2CallbackPage` extracts token
3. **JWT in localStorage**: Frontend stores `pv_token` + `pv_user`, attaches `Authorization: Bearer` header via `client.js`
4. **DTO mapping**: `PromptMapper` uses ModelMapper; `PromptEntity` has `@ManyToOne` to `UserEntity`
5. **Roles**: Stored as comma-separated string in `UserEntity.roles`, split in `CustomerDetailService`