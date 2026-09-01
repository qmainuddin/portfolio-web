# Portfolio & Lead Capture Platform

> Production-grade personal portfolio, engineering showcase, and AI-powered lead capture platform for **Mainuddin Talukdar** (`mainuddintalukdar.cloud`).

[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Resend](https://img.shields.io/badge/Resend-Email%20API-000000?style=flat-square&logo=resend&logoColor=white)](https://resend.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 📖 Overview

The **Portfolio & Lead Capture Platform** is engineered to deliver sub-second performance, high aesthetic polish, and an automated lead qualification pipeline. Built with Astro SSR, Tailwind CSS, and selective React islands, the platform provides an interactive overview of technical capabilities, architecture philosophies, project retrospectives, and an AI-evaluated resume distribution gate.

### ✨ Key Features

- ⚡ **Zero-Bloat SSR Architecture**: Astro 5 SSR standalone server with minimal clientside JavaScript and zero layout shifts.
- 🌓 **High-Contrast Dark & Light Design**: Deep obsidian dark mode and porcelain light mode with subtle neon accents and persistent state.
- 🎯 **AI-Powered Dynamic Resume Gate**:
  - Validates and captures visitor inquiries (`Email`, `Phone`, `Intent`).
  - Evaluates user intent (`Recruiter`, `Client`, `Engineering Peer`, `Spam`) via lightweight LLM classification with heuristic fallback.
  - Persists leads securely to Supabase PostgreSQL.
  - Dispatches customized, branded HTML emails containing the resume attachment via Resend API.
- 🧭 **Comprehensive Engineering Narrative**:
  - **Hero & Problem Statement**: Tackles real-world Agentic AI bottlenecks (token burn, context drift, brittle loops, runaway latency).
  - **Mission & Decision Matrices**: Cost vs. Latency vs. Maintainability trade-off framework.
  - **Categorized Skills Matrix**: Interactive Technical & Leadership capabilities with recency indicators.
  - **Experience & Impact**: Chronological metrics-driven career achievements.
  - **Key Projects & Failure Retrospectives**: Transparent architectural deep-dives, impact metrics, and long-term technical learnings.
- 🌐 **Ecosystem Integrations**:
  - Quick-access previews for ecosystem applications (`TradiePulse` & `MathQuest`).
  - Seamless link to external engineering blog.
- 🛡️ **Containerized VPS Deployment**: Multi-stage Docker container deployed to a private Hostinger VPS network (`stack`) behind Caddy reverse proxy with automated SSL.

---

## 🏛️ System Architecture

```
[ Visitor / Client Browser ]
             │
             │ HTTPS (TLS via Caddy)
             ▼
[ Hostinger VPS: Caddy Reverse Proxy ]
             │
             │ HTTP (Docker Internal Network: `stack`)
             ▼
[ Portfolio Web Container (Astro SSR / Node.js) ]
      ├── Static Assets & Islands (React Components)
      └── SSR API Endpoints
             ├── GET  /api/health (Uptime & Monitoring)
             └── POST /api/request-resume
                     │
                     ├── 1. Zod Payload Validation
                     ├── 2. AI Intent Classification (Gemini / OpenAI / Heuristics)
                     ├── 3. Lead Persistence (Supabase PostgreSQL)
                     ├── 4. Asset Fetching (Supabase Storage / Local Fallback)
                     └── 5. Transactional Dispatch (Resend Email API)
```

---

## 🛠️ Tech Stack & Directory Structure

```
├── .github/
│   ├── copilot-instructions.md         # AI entrypoint symlink
│   └── workflows/deploy.yml            # CI/CD (Test, Build, Deploy to VPS)
├── AGENTS.md                           # Strict AI agent guidelines & commands
├── CLAUDE.md                           # AI entrypoint symlink
├── Caddyfile.snippet                   # Host Caddy reverse proxy block
├── Dockerfile                          # Multi-stage production container
├── Makefile                            # Deterministic build, test, and dev targets
├── docs/
│   ├── deployment-guide.md             # VPS setup & GitHub Secrets configuration
│   └── specs/000-bootstrap.spec.md     # Technical specification
├── public/                             # Static assets, favicon, sample documents
├── src/
│   ├── components/                     # Astro & React UI components
│   │   ├── About.astro                 # Bio, story, social links, resume trigger
│   │   ├── AppsPreviewModal.tsx        # TradiePulse & MathQuest project previews
│   │   ├── Experience.astro            # Streamlined timeline with impact metrics
│   │   ├── Footer.astro                # High-contrast footer with system status
│   │   ├── Header.astro                # Top navigation shell
│   │   ├── Hero.astro                  # Problem statement & agentic AI hook
│   │   ├── MissionValues.astro         # Customer obsession & trade-off matrices
│   │   ├── Navbar.tsx                  # Sticky nav + theme toggle + apps menu
│   │   ├── Projects.astro              # Deep dives, retrospectives, placeholders
│   │   ├── ResumeModal.tsx             # 3-field modal gate with validation & states
│   │   └── SkillsMatrix.tsx            # Categorized matrix with recency tags
│   ├── layouts/
│   │   └── Layout.astro                # Base layout, SEO/OG, dark mode init
│   ├── lib/
│   │   ├── ai-intent.ts                # AI intent classification service
│   │   ├── db-schema.sql               # Supabase PostgreSQL DDL & RLS policies
│   │   ├── email.ts                    # Resend client & branded email template
│   │   └── supabase.ts                 # Supabase client & storage fetcher
│   ├── pages/
│   │   ├── 404.astro                   # Branded 404 page
│   │   ├── api/
│   │   │   ├── health.ts               # Healthcheck endpoint
│   │   │   └── request-resume.ts       # Resume request API
│   │   └── index.astro                 # Main single-page application
│   └── styles/
│       └── global.css                  # Design tokens, typography & animations
└── tests/                              # Automated Vitest test suite
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v22.x or later
- **npm**: v10.x or later
- **Docker & Docker Compose** (Optional for container testing)

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/qmainuddin/portfolio-web.git
   cd portfolio-web
   ```

2. **Install dependencies:**
   ```bash
   make setup
   # or: npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   *Note: The platform is built with resilient fallback handlers. In local development without live API keys, mock storage and heuristic intent classifiers will operate seamlessly.*

4. **Start the development server:**
   ```bash
   make dev
   # or: npm run dev
   ```
   The site will be available at `http://localhost:4321`.

---

## 🧪 Testing & Quality Assurance

All critical endpoints, schemas, email templates, and intent classifiers are backed by automated tests via [Vitest](https://vitest.dev/):

```bash
# Run full automated test suite
make test

# Run unit tests
make test-unit

# Generate coverage report
make test-coverage

# Run TypeScript and linter checks
make lint
```

---

## 🚢 Production Deployment

The project is containerized using a multi-stage `Dockerfile` and configured to run on Hostinger VPS within the Docker `stack` network.

### 1. Build and Run Container Locally
```bash
make docker-build
make docker-up
```

### 2. Hostinger VPS & Caddy Reverse Proxy
Refer to [`docs/deployment-guide.md`](docs/deployment-guide.md) for full instructions on configuring:
- External Docker network `stack`
- Caddy reverse proxy integration (`Caddyfile.snippet`)
- GitHub Actions CI/CD Secrets (`VPS_HOST`, `VPS_SSH_KEY`, `VPS_USERNAME`)

---

## 🔒 Security & Privacy Notice
- No production secrets or sensitive API keys are committed to this repository.
- Lead contact information submitted via the resume gate is protected by Supabase Row-Level Security (RLS) policies and encrypted in transit.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
