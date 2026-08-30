# Spec 000: Portfolio & Lead Capture Platform Bootstrap

## 1. Executive Summary
This document specifies the technical requirements, architecture, data schemas, API contracts, and non-goals for the enterprise-grade personal portfolio and dynamic lead capture platform for **Mainuddin Talukdar** (`mainuddintalukdar.cloud`).

---

## 2. Core Objectives & Acceptance Criteria

### A. Performance & UX Standards
- [x] High-contrast, minimalist dark/light design system with zero layout shifts (CLS < 0.05).
- [x] Fast time-to-interactive (< 1.5s on 4G connections) using Astro's zero-JS-by-default architecture and selective React islands.
- [x] Full responsive mobile, tablet, and desktop fidelity with sticky navigation and accessible controls.

### B. Dynamic Resume Gate & Lead Capture
- [x] Interactive modal dialog with 3-field input:
  1. `email` (Required, valid email format)
  2. `phone` (Optional, standard telephone regex or empty)
  3. `intent` (Required, minimum 5 characters, explanation of request)
- [x] AI Intent Pipeline:
  - Classifies inbound text into `Recruiter`, `Client`, `Engineering Peer`, or `Spam`.
  - Generates intent score and summary.
  - Falls back gracefully to heuristic classification if AI API is unavailable.
- [x] Supabase Persistence:
  - Records request in PostgreSQL `resume_requests` table with IP hash and user agent.
- [x] Email Dispatch:
  - Fetches resume asset and dispatches branded transactional email to recipient via Resend API.
  - Displays instant success confirmation in the UI with a direct download button fallback.

### C. Sections & Content Strategy
1. **Hero**: High-impact problem statement tackling modern agentic AI bottlenecks (token burn, context drift, brittle loops, runaway latency) vs deterministic, cost-effective engineering.
2. **About Me**: Professional tagline, bio, career context, GitHub & LinkedIn links (no scraped plaintext emails).
3. **Mission & Values**: Customer obsession, sustainable architecture, Cost vs. Latency vs. Maintainability trade-off matrix, vision quote ("Making the world of Agentic AI usable, maintainable, and extensible").
4. **Skills Matrix**: Categorized interactive matrix (Technical & Leadership) with recency indicators and technology badges.
5. **Experience**: Streamlined chronological timeline with quantifiable metrics.
6. **Projects & Retrospectives**: Featured engineering deep dives with architecture, concrete impact, and thoughtful "Failure & Adaptation" retrospective, plus 2 structured upcoming project cards.
7. **Extensions**: Blog link (`https://blog.mainuddintalukdar.cloud`) and Apps dropdown (`TradiePulse`, `MathQuest`).

---

## 3. Data Schema & Contracts

### Supabase Table: `resume_requests`
```sql
CREATE TABLE IF NOT EXISTS public.resume_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  intent_raw TEXT NOT NULL,
  intent_category TEXT NOT NULL CHECK (intent_category IN ('Recruiter', 'Client', 'Engineering Peer', 'Spam')),
  intent_score NUMERIC(3,2) DEFAULT 1.00,
  intent_summary TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### API Endpoint: `POST /api/request-resume`
- **Request Body**:
  ```json
  {
    "email": "lead@company.com",
    "phone": "+1234567890",
    "intent": "We are hiring a Lead AI / Full-Stack Engineer for our platform."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Resume sent successfully to your email!",
    "data": {
      "id": "uuid-v4",
      "category": "Recruiter",
      "downloadUrl": "/assets/resume-sample.pdf"
    }
  }
  ```
- **Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "error": "Validation failed",
    "details": [{ "field": "email", "message": "Invalid email address" }]
  }
  ```

### API Endpoint: `GET /api/health`
- **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 124.5,
    "timestamp": "2026-08-30T21:30:00.000Z"
  }
  ```

---

## 4. Non-Goals
- Real-time chat widget (avoiding unmonitored token burn and latency).
- Public unauthenticated direct resume PDF scraping (all requests must pass the gate).
- Client-side storage of sensitive API credentials.
