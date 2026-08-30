# AGENTS.md - Portfolio & Lead Capture Platform

Welcome to the **Portfolio & Lead Capture Platform** repository for `mainuddintalukdar.cloud`.
This file serves as the canonical directive and guidelines file for all AI coding agents (Antigravity, Claude Code, Copilot, Cursor, Codex).

---

## 1. Project Identity & Architecture
- **Domain**: `mainuddintalukdar.cloud`
- **Application Type**: High-performance Full-Stack Web Platform & Lead Capture System
- **Tech Stack**:
  - **Framework**: [Astro 5](https://astro.build/) in Server-Side Rendering (SSR) mode with `@astrojs/node` standalone adapter.
  - **UI & Islands**: [Tailwind CSS](https://tailwindcss.com/) for styling with [React](https://react.dev/) for interactive client islands (`ResumeModal`, `Navbar`, `SkillsMatrix`, `AppsPreviewModal`).
  - **Database & Storage**: [Supabase](https://supabase.com/) PostgreSQL (`resume_requests` table) + Supabase Storage for secure resume retrieval.
  - **Email Dispatch**: [Resend API](https://resend.com/) with branded HTML templates and fallback mock logger.
  - **AI Intent Classification**: Lightweight LLM API (Gemini / OpenAI) with deterministic fallback heuristics.
  - **Infrastructure**: Docker multi-stage container attached to external Docker network `stack` behind a Hostinger VPS Caddy reverse proxy.
  - **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) testing, building, and deploying via SSH.

---

## 2. Universal Agent Constraints & Operating Rules

### Strict Secrets & Security Rules
- **NEVER** hardcode or commit actual API keys, database connection strings, passwords, or SSH keys to Git.
- Always load configuration via `process.env` / `import.meta.env` with sensible fallbacks for local test/dev environments.
- Use `.env.example` as the single source of truth for required environment variables.

### Build, Run, Test & Quality Commands
Always use the standardized `Makefile` commands or deterministic npm scripts:

| Command | Purpose |
|---|---|
| `make setup` | Install all dependencies cleanly (`npm install`) |
| `make dev` | Run local Astro development server on port 4321 (`npm run dev`) |
| `make test` | Execute full automated test suite with Vitest (`npm test`) |
| `make test-unit` | Run unit tests (`npm run test:unit`) |
| `make test-coverage` | Run tests and generate coverage report |
| `make lint` | Run TypeScript type checks and lint checks (`npm run lint`) |
| `make build` | Build standalone production Astro bundle (`npm run build`) |
| `make docker-build`| Build production Docker image |
| `make clean` | Remove `.astro/`, `dist/`, `node_modules/`, and coverage dumps |

### Code Style & Architectural Conventions
1. **Zero Unhandled Errors**: All API routes (`/api/*`) must wrap operations in `try-catch` blocks and return structured JSON responses:
   ```json
   { "success": true, "data": { ... } }
   // or
   { "success": false, "error": "Human-readable message", "code": "ERROR_CODE" }
   ```
2. **Strict Validation**: Always validate inbound user payloads using `zod` before executing database queries or external API calls.
3. **Resilience & Fallbacks**:
   - If Supabase is unreachable or unconfigured in dev/test, fallback gracefully to mock storage with console logging.
   - If the AI intent analyzer API key is not present, classify intents using deterministic heuristic pattern matching.
   - If Resend API key is missing, mock dispatch and log email contents.
4. **Accessibility (a11y) & UX**:
   - Use semantic HTML tags (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
   - All interactive elements must support keyboard navigation (`Tab`, `Esc`, `Enter`), ARIA labels, and visible focus rings.
   - Theme toggle must respect `prefers-color-scheme` and persist to `localStorage`.

---

## 3. Directory Layout
```
├── .aiignore                           # AI context ignore list
├── .env.example                        # Typed configuration template
├── .github/
│   ├── copilot-instructions.md         # Symlink -> AGENTS.md
│   └── workflows/deploy.yml            # CI/CD Pipeline
├── AGENTS.md                           # This canonical agent guide
├── CLAUDE.md                           # Symlink -> AGENTS.md
├── Caddyfile.snippet                   # Caddy reverse proxy configuration
├── Dockerfile                          # Multi-stage production container
├── Makefile                            # Deterministic build commands
├── README.md                           # Public architecture & developer documentation
├── docs/
│   ├── deployment-guide.md             # Operations & Hostinger VPS guide
│   └── specs/000-bootstrap.spec.md     # Engineering specification
├── public/                             # Static assets, favicon, sample documents
├── src/
│   ├── components/                     # Astro & React UI components
│   ├── layouts/                        # Base Astro layout (SEO, theme, fonts)
│   ├── lib/                            # Database, AI, and email services
│   ├── pages/                          # SSR pages & /api endpoints
│   └── styles/                         # Global Tailwind styles & design tokens
└── tests/                              # Unit & integration test suites
```
