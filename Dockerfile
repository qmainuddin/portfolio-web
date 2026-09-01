# ==============================================================================
# Multi-Stage Production Dockerfile for Portfolio & Lead Capture Platform
# Target Platform: Node.js 22 on Alpine Linux (Minimal Attack Surface)
# ==============================================================================

# --- Stage 1: Dependency & Build Base ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install build prerequisites
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for Astro build)
RUN npm ci || npm install

# Copy source code and configuration files
COPY . .

# Build standalone Astro SSR bundle
ENV NODE_ENV=production
RUN npm run build

# Prune dev dependencies for production runtime
RUN npm prune --production

# --- Stage 2: Production Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

# Add unprivileged user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy build artifacts and pruned node_modules from builder
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/public ./public
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

# Switch to non-root user
USER astro

# Expose internal application port
EXPOSE 4321

# Healthcheck probe for container orchestrator / Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/api/health || exit 1

# Start the standalone Astro SSR server
CMD ["node", "./dist/server/entry.mjs"]
