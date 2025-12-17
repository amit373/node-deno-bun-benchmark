import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { validateEnv, Config } from '@student-api/shared-config';
import { Logger } from '@student-api/shared-logger';
import { JwtUtil } from '@student-api/shared-utils';
import { Database } from './db/connection';
import { authRoutes } from './routes/auth.routes';
import { studentRoutes } from './routes/student.routes';
import { classRoutes } from './routes/class.routes';
import { gradeRoutes } from './routes/grade.routes';
import { reportRoutes } from './routes/report.routes';
import { BunErrorHandler } from './utils/error-handler';
import { ProcessHandlers } from './utils/process-handlers';

const env = validateEnv();
Config.initialize(env);
Logger.initialize('bun');
JwtUtil.initialize(Config.jwtSecret, Config.jwtRefreshSecret);

const db = Database.getInstance();
await db.connect();

const app = new Elysia()
  .use(
    swagger({
      path: 'api-docs',
      documentation: {
        info: {
          title: 'Student Management API - Bun',
          version: '1.0.0',
          description: 'Production-ready Student Management API built with Bun + Elysia + MongoDB',
        },
        servers: [
          {
            url: `http://localhost:${Config.port}`,
            description: 'Development server',
          },
          {
            url: 'http://localhost:3001',
            description: 'Bun API',
          },
        ],
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Students', description: 'Student management endpoints' },
          { name: 'Classes', description: 'Class management endpoints' },
          { name: 'Grades', description: 'Grade management endpoints' },
          { name: 'Reports', description: 'Performance report endpoints' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'Enter your JWT token',
            },
          },
        },
      },
    })
  )
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    runtime: 'bun',
  }))
  .group('/api/v1', (app) =>
    app.use(authRoutes).use(studentRoutes).use(classRoutes).use(gradeRoutes).use(reportRoutes)
  )
  .onError((context) => BunErrorHandler.handle(context as unknown as { code: string; error: unknown; set: { status: number } }));

const server = app.listen(Config.port, () => {
  Logger.info(`Bun API running on port ${Config.port}`, {
    runtime: 'bun',
    environment: Config.nodeEnv,
    swagger: `http://localhost:${Config.port}/api-docs`,
  });
});

// Setup process handlers
ProcessHandlers.setupHandlers(server, db);

export type App = typeof app;
