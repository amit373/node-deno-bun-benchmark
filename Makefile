.PHONY: help dev build lint test test-all test-express test-bun test-deno clean docker-build docker-up docker-down install benchmark dev-express dev-bun dev-deno setup

help:
	@echo "Available commands:"
	@echo "  make setup         - Create .env files from .env.example and install dependencies"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Start all apps in development mode"
	@echo "  make dev-express   - Start Express API only (port 3000)"
	@echo "  make dev-bun       - Start Bun API only (port 3001)"
	@echo "  make dev-deno      - Start Deno API only (port 3002)"
	@echo "  make build         - Build all apps"
	@echo "  make lint          - Lint all apps"
	@echo "  make test          - Run all tests"
	@echo "  make test-all      - Run all tests (alias for test)"
	@echo "  make test-express  - Run Express API tests only"
	@echo "  make test-bun      - Run Bun API tests only"
	@echo "  make test-deno     - Run Deno API tests only"
	@echo "  make clean         - Clean all build artifacts"
	@echo "  make docker-build  - Build all Docker images"
	@echo "  make docker-up     - Start all services with Docker Compose"
	@echo "  make docker-down   - Stop all Docker services"
	@echo "  make benchmark     - Run performance benchmarks"

setup:
	@echo "Setting up environment files..."
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
	else \
		echo ".env already exists, skipping..."; \
	fi
	@if [ ! -f apps/express-api/.env ]; then \
		echo "Creating apps/express-api/.env from .env.example..."; \
		cp apps/express-api/.env.example apps/express-api/.env; \
	else \
		echo "apps/express-api/.env already exists, skipping..."; \
	fi
	@if [ ! -f apps/bun-api/.env ]; then \
		echo "Creating apps/bun-api/.env from .env.example..."; \
		cp apps/bun-api/.env.example apps/bun-api/.env; \
	else \
		echo "apps/bun-api/.env already exists, skipping..."; \
	fi
	@if [ ! -f apps/deno-api/.env ]; then \
		echo "Creating apps/deno-api/.env from .env.example..."; \
		cp apps/deno-api/.env.example apps/deno-api/.env; \
	else \
		echo "apps/deno-api/.env already exists, skipping..."; \
	fi
	@echo "Environment files setup complete!"
	@echo "Installing dependencies..."
	@$(MAKE) install

install:
	pnpm install

dev:
	@echo "Stopping any running Docker API containers..."
	@docker stop express-api bun-api deno-api 2>/dev/null || true
	@echo "Killing processes on ports 3000, 3001, 3002..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3002 | xargs kill -9 2>/dev/null || true
	@echo "Starting MongoDB via Docker..."
	@docker-compose up -d mongodb
	@sleep 2
	@echo "Starting dev servers..."
	pnpm run dev

build:
	pnpm run build

lint:
	pnpm run lint

test:
	pnpm run test

test-all:
	@echo "Running all tests..."
	@pnpm run test

test-express:
	@echo "Running Express API tests..."
	@cd apps/express-api && pnpm run test

test-bun:
	@echo "Running Bun API tests..."
	@cd apps/bun-api && pnpm run test

test-deno:
	@echo "Running Deno API tests..."
	@cd apps/deno-api && pnpm run test

clean:
	pnpm run clean

docker-build:
	docker-compose build

docker-up:
	@echo "Killing processes on ports 3000, 3001, 3002..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3002 | xargs kill -9 2>/dev/null || true
	@echo "Starting Docker containers..."
	docker-compose up -d

docker-down:
	docker-compose down

benchmark:
	@echo "Running benchmarks..."
	@cd apps/express-api && pnpm run benchmark
	@cd apps/bun-api && pnpm run benchmark
	@cd apps/deno-api && pnpm run benchmark

dev-express:
	@echo "Killing process on port 3000..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@echo "Starting MongoDB via Docker..."
	@docker-compose up -d mongodb
	@sleep 2
	@echo "Starting Express API on port 3000..."
	@cd apps/express-api && pnpm run dev

dev-bun:
	@echo "Killing process on port 3001..."
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@echo "Starting MongoDB via Docker..."
	@docker-compose up -d mongodb
	@sleep 2
	@echo "Starting Bun API on port 3001..."
	@cd apps/bun-api && bun run dev

dev-deno:
	@echo "Killing process on port 3002..."
	@lsof -ti:3002 | xargs kill -9 2>/dev/null || true
	@echo "Starting MongoDB via Docker..."
	@docker-compose up -d mongodb
	@sleep 2
	@echo "Starting Deno API on port 3002..."
	@cd apps/deno-api && deno task dev
