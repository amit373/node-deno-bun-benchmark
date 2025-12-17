# Express API (Node.js 22)

Production-ready Student Management API built with Express.js and TypeScript.

## Features

- **MVC Architecture**: Clean separation of concerns
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **RBAC**: Role-based access control with permissions
- **Validation**: Zod schemas for request validation
- **Error Handling**: Global error handler with proper status codes
- **Logging**: Structured logging with Pino
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, compression
- **API Documentation**: Swagger/OpenAPI via JSDoc
- **Testing**: Jest with coverage
- **Benchmarking**: Performance testing utilities

## Getting Started

### Prerequisites

- Node.js 22.x LTS
- pnpm 8.x

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

### Production

```bash
pnpm run start
```

### Testing

```bash
# Run tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage
pnpm run test:coverage
```

### Benchmarking

```bash
pnpm run benchmark
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Students

- `GET /api/v1/students` - List students (paginated)
- `GET /api/v1/students/:id` - Get student
- `POST /api/v1/students` - Create student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

### Classes

- `GET /api/v1/classes` - List classes
- `GET /api/v1/classes/:id` - Get class
- `POST /api/v1/classes` - Create class
- `PUT /api/v1/classes/:id` - Update class
- `DELETE /api/v1/classes/:id` - Delete class

### Grades

- `GET /api/v1/grades/student/:id` - Get student grades
- `POST /api/v1/grades` - Create grade
- `PUT /api/v1/grades/:id` - Update grade
- `DELETE /api/v1/grades/:id` - Delete grade

### Reports

- `GET /api/v1/reports/students/:id` - Student report
- `GET /api/v1/reports/performance/:id` - Performance report

## Docker

```bash
# Build
docker build -t express-api .

# Run
docker run -p 3000:3000 express-api
```

## License

MIT
