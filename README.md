# 🚀 Student Management API - Node.js vs Deno vs Bun Benchmark

[![CI/CD](https://github.com/yourusername/student-api/workflows/CI/badge.svg)](https://github.com/yourusername/student-api/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![Deno](https://img.shields.io/badge/Deno-2.x-black)](https://deno.land/)
[![Bun](https://img.shields.io/badge/Bun-1.2-orange)](https://bun.sh/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

Production-ready Student Management API monorepo comparing **Node.js 22**, **Deno 2**, and **Bun 1.2** runtimes with identical features and **MongoDB-only** database architecture.

## ✨ Features

- **🏗️ MVC Architecture**: Clean separation with controllers, services, models
- **🗄️ MongoDB Only**: Single database solution across all runtimes (no mock data)
- **🔐 JWT Authentication**: Access + refresh tokens
- **👮 RBAC**: Role-based access control (SUPER_ADMIN, ADMIN, TEACHER, STUDENT, PARENT)
- **✅ Zod Validation**: Type-safe request validation
- **📝 Logging**: Structured logging with Pino
- **🌱 Database Seeders**: Comprehensive seed scripts for each runtime
- **🐳 Docker**: Multi-stage builds for all runtimes
- **🧪 Testing**: Jest (Node), Vitest (Bun), Deno.test
- **⚡ Benchmarks**: Performance comparison scripts
- **📊 Swagger**: API documentation via JSDoc
- **🔄 Monorepo**: TurboRepo + PNPM workspaces

## 📦 Project Structure

```
├── apps/
│   ├── express-api/     # Node.js 22 + Express
│   ├── bun-api/         # Bun 1.2 + Elysia
│   └── deno-api/        # Deno 2 + Oak
├── packages/
│   ├── shared-types/
│   ├── shared-constants/
│   ├── shared-zod-schemas/
│   ├── shared-utils/
│   ├── shared-logger/
│   ├── shared-config/
│   ├── shared-middleware/
│   ├── eslint-config/
│   └── tsconfig/
├── docker-compose.yml
├── Makefile
└── turbo.json
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start MongoDB and Redis
docker-compose up -d mongodb redis

# Seed the database (choose one runtime)
cd apps/express-api && pnpm seed
# OR
cd apps/bun-api && bun run seed
# OR
cd apps/deno-api && deno task seed

# Start all APIs in development
make dev

# Or individually
cd apps/express-api && pnpm dev  # Port 3000
cd apps/bun-api && bun dev       # Port 3001
cd apps/deno-api && deno task dev # Port 3002
```

### Default Login Credentials

After seeding, use these credentials to test the API:

- **Admin**: `admin@school.com` / `admin123`
- **Teacher**: `john.teacher@school.com` / `teacher123`
- **Student**: `alice.johnson@school.com` / `student123`

## 🐳 Docker

```bash
# Start all services
make docker-up

# Build images
make docker-build

# Stop services
make docker-down
```

## 📊 API Endpoints

All three runtimes expose identical endpoints:

### Authentication

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Current user

### Students

- `GET /api/v1/students` - List (paginated)
- `GET /api/v1/students/:id` - Get by ID
- `POST /api/v1/students` - Create
- `PUT /api/v1/students/:id` - Update
- `DELETE /api/v1/students/:id` - Delete

### Classes, Grades, Reports

Similar CRUD operations for classes, grades, and performance reports.

## 🧪 Testing

```bash
make test
```

## ⚡ Benchmarks

```bash
make benchmark
```

## 🗄️ Database Architecture

This project uses **MongoDB exclusively** across all three runtimes:

- **Node.js**: Mongoose ORM with schema validation
- **Deno**: MongoDB native driver with TypeScript interfaces
- **Bun**: MongoDB native driver with TypeScript interfaces

### Collections

- `users` - Authentication and user profiles
- `students` - Student records linked to users
- `classes` - Course information
- `grades` - Student grades and assessments

See [`MONGODB_MIGRATION.md`](./MONGODB_MIGRATION.md) for detailed schema documentation and migration guide.

## 📝 License

MIT

---

**Architecture**: MongoDB-only, no mock data, fully database-driven across all runtimes!

## 📱 Share on LinkedIn

Want to share this project? Check out [`LINKEDIN_POST.md`](./LINKEDIN_POST.md) for a ready-to-use LinkedIn post template!
