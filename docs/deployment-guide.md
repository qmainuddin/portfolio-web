# Hostinger VPS & Deployment Operations Guide

This guide provides step-by-step instructions for provisioning, configuring, and operating the **Portfolio & Lead Capture Platform** on a Hostinger VPS with Docker and Caddy reverse proxy.

---

## 1. Hostinger VPS Initial Prerequisites

Ensure your Hostinger VPS is running Ubuntu 22.04 or 24.04 with Docker and Docker Compose installed.

### A. Install Docker Engine (if not already installed)
```bash
sudo apt update && sudo apt install -y curl git
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### B. Create Shared `stack` Docker Network
All web containers on the VPS share the `stack` bridge network so Caddy can route traffic internally:
```bash
docker network create stack || true
```

---

## 2. Host Caddy Reverse Proxy Setup

If Caddy is running as a container or systemd service on your VPS, add the `mainuddintalukdar.cloud` site block:

### Edit Caddyfile
```bash
sudo nano /etc/caddy/Caddyfile
# Or if Caddy is in Docker: nano /home/user/caddy/Caddyfile
```

Append the configuration from [`Caddyfile.snippet`](../Caddyfile.snippet):

```caddy
mainuddintalukdar.cloud, www.mainuddintalukdar.cloud {
    encode zstd gzip

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    reverse_proxy portfolio-web:4321 {
        health_uri /api/health
        health_interval 30s
        health_timeout 5s

        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

Reload Caddy:
```bash
sudo systemctl reload caddy
# Or if Caddy is in Docker: docker exec -w /etc/caddy caddy caddy reload
```

---

## 3. GitHub Actions CI/CD Secrets Setup

Navigate to your GitHub Repository **Settings** &rarr; **Secrets and variables** &rarr; **Actions** &rarr; **New repository secret**:

| Secret Name | Description | Example / Format |
|---|---|---|
| `VPS_HOST` | IPv4 address of your Hostinger VPS | `194.163.xxx.xxx` |
| `VPS_USERNAME` | SSH username on VPS | `root` or `deployer` |
| `VPS_SSH_KEY` | Private OpenSSH Key (`id_ed25519` or `id_rsa`) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SUPABASE_URL` | Supabase Project URL | `https://your-project-id.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Modern Supabase Publishable / Publisher Key | `sb_publishable_...` |
| `SUPABASE_SECRET_KEY` | Modern Supabase Secret Key (Server-Side) | `sb_secret_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | (Legacy Fallback) Supabase Service Role Key | `eyJhbGciOi...` |
| `RESEND_API_KEY` | Resend Production API Key | `re_abc123...` |
| `RESEND_FROM_EMAIL` | Verified Sender Email | `Mainuddin Talukdar <career@mainuddintalukdar.cloud>` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `OPENAI_API_KEY` | OpenAI API Key (Optional alternative) | `sk-...` |

---

## 4. Manual Deployment & Local Testing

You can also deploy or test manually directly on the VPS or your workstation:

```bash
# 1. Clone repository
git clone https://github.com/qmainuddin/portfolio-web.git
cd portfolio-web

# 2. Configure .env
cp .env.example .env
# Edit .env with your live keys

# 3. Build & start container
docker compose -f docker-compose.prod.yml up -d --build

# 4. Verify health endpoint
curl http://localhost:4321/api/health
```
