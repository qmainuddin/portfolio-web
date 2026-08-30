# ==============================================================================
# Portfolio & Lead Capture Platform - Standardized Automation Makefile
# ==============================================================================

SHELL := /bin/bash
.PHONY: help setup dev build test test-unit test-coverage lint clean docker-build docker-up docker-down deploy

help: ## Display available commands
	@echo "Portfolio & Lead Capture Platform - Available Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Install dependencies cleanly
	npm ci || npm install

dev: ## Start Astro local development server
	npm run dev

build: ## Build the standalone Astro SSR production bundle
	npm run build

test: ## Run the full Vitest automated test suite
	npm run test

test-unit: ## Run unit tests specifically
	npm run test:unit

test-coverage: ## Run test suite with coverage report
	npm run test:coverage

lint: ## Run TypeScript type-checking and linter checks
	npm run lint

clean: ## Clean build artifacts, temporary caches, and test coverage
	rm -rf dist .astro coverage .nyc_output node_modules/.vite

docker-build: ## Build the production Docker image locally
	docker build -t portfolio-web:latest .

docker-up: ## Start production container locally on 'stack' network
	docker compose -f docker-compose.prod.yml up -d

docker-down: ## Stop production container
	docker compose -f docker-compose.prod.yml down

deploy: lint test build ## Run full CI checks and prepare release
	@echo "✅ Pre-deployment checks passed. Ready for release."
