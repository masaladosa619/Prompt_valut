# Prompt Vault 🔐✨

Prompt Vault is an enterprise-grade prompt gateway and template management system designed to streamline, secure, and organize LLM prompt engineering workflows. Built with a robust Spring Boot 3.x backend and a highly polished, developer-centric React frontend, it acts as a centralized library where teams can create, secure, discover, and deploy prompts.

---

## 🚀 Key Features

### 1. Unified Prompt Library
- **Create & Manage:** Write reusable prompt templates configured for specific LLM targets (e.g., GPT-4o, Claude 3.5 Sonnet, Gemini).
- **Search & Filter:** Find prompts instantly by title, target LLM model, category (Coding, Writing, Analysis, Prompt Engineering), or tags.

### 2. Enterprise-Grade Security
- **JWT Authentication:** Stateful token-based authentication protecting write/delete API endpoints.
- **Secure Self-Registration:** Built-in safeguards preventing unauthorized role escalation during signup; all registrations default to `ROLE_DEVELOPER`.
- **OAuth2 Integration:** Seamless social login via Google and GitHub with automatic user profile creation.
- **Admin Management:** Secure permission checks allowing administrators (`ROLE_ADMIN`) to moderate community prompts directly.

### 3. Community Sharing & Collaboration
- **Forking System:** Copy shared community prompts into your private library with one click.
- **Prompt Pinning:** "Heart" your favorite prompts to automatically pin them to the top of your dashboard feed, persisted locally via secure state.
- **Easy Copying:** Quick clipboard export features for rapid iteration.

### 4. Developer-Centric UX
- **Premium Aesthetics:** Sleek dark-mode interface with clean border highlights, subtle glowing micro-animations, and glassmorphic card designs.
- **Fluid Interactions:** Interactive particle click sparks, curved loop animations, and smooth transitions.

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.x (Java 21)
- **Security:** Spring Security (JWT filter chain & OAuth2 Client integration)
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **Mapper:** MapStruct
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18 (Vite-based SPA)
- **Icons:** Lucide React
- **Animations & Visuals:** Canvas-based interactive click sparks (`ClickSpark`), curved text animation loops (`CurvedLoop`), and edge-glow animations (`BorderGlow`).
- **Styling:** Modular Vanilla CSS with custom design tokens for glassmorphism.

---

## 📁 Repository Structure

```text
├── backend/                   # Spring Boot backend files (reorganized)
│   ├── src/                   # Java Source Code
│   ├── pom.xml                # Maven Dependencies & Configuration
│   ├── mvnw                   # Maven Wrapper (Unix)
│   └── mvnw.cmd               # Maven Wrapper (Windows)
├── frontend/                  # Vite + React frontend files
│   ├── src/
│   │   ├── components/        # Reusable UI components (Sidebar, ClickSpark, etc.)
│   │   ├── pages/             # Page components (Dashboard, Community, Login)
│   │   ├── api/               # API clients and HTTP handler layers
│   │   └── App.jsx            # React root component and Routing
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- **Java JDK 21** or higher
- **Node.js** v18 or higher (with `npm`)
- **PostgreSQL** running locally or in a container

### 1. Database Setup
Create a PostgreSQL database named `prompt_vault`:
```sql
CREATE DATABASE prompt_vault;
```

### 2. Backend Configurations
1. Open the backend configuration file: `backend/src/main/resources/application.properties` (or similar).
2. Configure the database credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5000/prompt_vault
   spring.datasource.username=YOUR_DB_USER
   spring.datasource.password=YOUR_DB_PASSWORD
   ```
3. Set up OAuth2 Client IDs (for Google/GitHub login) if applicable.

Run the backend using the Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```
The backend API will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will start on `http://localhost:5173`.

---

## 🔒 Security & Roles Architecture

Prompt Vault implements role-based security separating general developers from administrators.

### Roles
- **ROLE_DEVELOPER:** Default role for all new self-registrations. Allowed to create, view, search, and fork prompts.
- **ROLE_ADMIN:** Administrator role. Has additional powers, including the ability to delete shared community prompts.


---

## 📄 License
This project is licensed under the MIT License.
