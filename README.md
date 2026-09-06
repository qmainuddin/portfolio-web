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

All critical endpoints, schemas, email templates, intent classifiers, and database handlers are backed by **39 automated tests across 6 test suites** via [Vitest](https://vitest.dev/):

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

### 📋 Test Suites Breakdown

| Test Suite | Test Count | Scope & Covered Scenarios |
|---|:---:|---|
| **[`tests/unit/validation.test.ts`](tests/unit/validation.test.ts)** | 11 tests | • Valid full payload parsing (`name`, `email`, `phone`, `intent`)<br>• Optional phone omission handling<br>• Empty / missing name rejection<br>• Invalid email syntax rejection<br>• Intent length constraints (minimum 5 chars, maximum 1000 chars)<br>• International phone formatting (`+1 (555) 019-2834`, `021 123 4567`, `+44 20 7946 0919`) and invalid phone rejection<br>• International name character support (`François Müller`, `José Gómez`, `René-Jean Martin`)<br>• Automatic whitespace sanitization and trimming across all fields |
| **[`tests/unit/ai-intent.test.ts`](tests/unit/ai-intent.test.ts)** | 12 tests | • Recruiter & hiring intent detection (talent acquisition, headhunters, open positions)<br>• Client & consulting intent detection (quotations, budget, MVP commissions, SaaS)<br>• Engineering peer detection (AST agents, architecture, prompt caching, open-source)<br>• Spam & scam detection (`crypto`, `viagra`, `free money`, `casino`, `lottery`, shortened URLs like `bit.ly`, `http://`, `https://`)<br>• Word-boundary regex matching preventing false positives (e.g. `rate` inside `strategy`)<br>• Whitespace-only input handling<br>• Empty input resilience<br>• Case-insensitivity validation (e.g., ALL CAPS inquiries) |
| **[`tests/unit/email-template.test.ts`](tests/unit/email-template.test.ts)** | 7 tests | • Recruiter email personalization and branding<br>• Client consulting email personalization<br>• Engineering peer email personalization<br>• Fallback greeting (`"Hello,"`) when name is omitted or whitespace<br>• Fallback intro text for unrecognized intent categories<br>• Simulated transactional resume email dispatch via Resend in mock mode<br>• Simulated admin lead notification email dispatch (`sendLeadNotificationEmail`) in mock mode |
| **[`tests/unit/supabase.test.ts`](tests/unit/supabase.test.ts)** | 2 tests | • Offline / development fallback storage persistence in `mockResumeRequests`<br>• Data integrity verification for all record columns (`name`, `email`, `phone`, `intent_raw`, `intent_category`, `intent_score`, `user_agent`, `ip_hash`, `status`)<br>• Resume PDF binary buffer retrieval and valid filename check |
| **[`tests/integration/api-health.test.ts`](tests/integration/api-health.test.ts)** | 1 test | • Health check endpoint (`GET /api/health`) returning HTTP 200, uptime, version, and memory usage for Docker / Caddy monitoring |
| **[`tests/integration/api-request-resume.test.ts`](tests/integration/api-request-resume.test.ts)** | 6 tests | • End-to-end JSON request processing, intent classification, DB persistence, and email dispatch<br>• Multi-part `FormData` (`application/x-www-form-urlencoded`) payload handling<br>• HTTP 400 rejection for missing email, invalid phone format, and short intent<br>• Spam submission flagging (stores record with `status: 'flagged'` without dispatching emails)<br>• Client metadata extraction (`X-Real-IP`, `X-Forwarded-For`, `User-Agent`) and IP hashing |

---

## 🗺️ Phase 2 Expansion & Feature Roadmap

The platform architecture is designed to be modular and extensible. The following initiatives are scheduled for Phase 2 implementation:

### 1. 📊 Authenticated Lead Management & Telemetry Dashboard (`/admin`)
- **Supabase Auth Integration**: Secure role-based admin login with multi-factor authentication (MFA).
- **Interactive Kanban & Table View**: Filter, search, and update lead status (`new` &rarr; `contacted` &rarr; `interviewing` &rarr; `closed`).
- **Real-Time Telemetry & Insights**: Visual charts showing weekly lead volume, conversion by category (`Recruiter` vs. `Client`), and geographical IP distribution.

### 2. 📝 Subdomain Blog Platform (`blog.mainuddintalukdar.cloud`)
- **MDX & Content Collections**: Full-featured technical blogging engine with syntax highlighting, LaTeX math support, reading time estimates, and SEO tags.
- **Deep-Dive Technical Articles**: Dedicated series on deterministic Agentic AI, token optimization, and cost-governed distributed architectures.
- **Shared Design Tokens**: Unified navbar, footer, and theme state across the main domain and blog subdomain.

### 3. 🧪 Interactive Architecture Labs & Live Demos
- **Live AI Agent Sandbox**: An interactive browser widget demonstrating real-time AST context slicing, prompt caching latency graphs, and token cost calculators.
- **Embedded App Previews**: Interactive interactive demo canvases for `TradiePulse` and `MathQuest`.

### 4. 🛡️ Advanced Security, Rate Limiting & Webhook Alerts
- **Distributed Redis Rate Limiting**: Integration with Upstash Redis to enforce strict sliding-window request limits on `/api/request-resume` (e.g. 5 requests/IP/hour).
- **Instant Webhook Notifications**: Real-time dispatch of high-priority leads to private Slack / Discord channels or Telegram bot alerts.
- **Optional Turnstile Verification**: Seamless Cloudflare Turnstile bot challenge for high-risk IP footprints.

### 5. 📄 Dynamic Resume Customization & Analytics
- **Tailored Resume Generator**: Dynamically highlight relevant technical experience based on verified intent category (e.g., emphasis on Cloud/DevOps for infrastructure leads vs. AI Agents for LLM research leads).
- **Resume Download Analytics**: Granular telemetry on PDF downloads, link click-throughs, and email delivery receipts.

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
