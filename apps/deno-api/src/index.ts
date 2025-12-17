import { Application } from 'oak';
import { validateEnv, Config } from '@student-api/shared-config';
import { Logger } from '@student-api/shared-logger';
import { JwtUtil } from '@student-api/shared-utils';
import { Database } from './db/connection.ts';
import { errorHandler } from './middleware/error-handler.ts';
import { authRouter } from './routes/auth.routes.ts';
import { studentRouter } from './routes/student.routes.ts';
import { classRouter } from './routes/class.routes.ts';
import { gradeRouter } from './routes/grade.routes.ts';
import { reportRouter } from './routes/report.routes.ts';
import { openApiSpec } from './openapi.ts';
import { getSwaggerHTML } from './swagger/ui.ts';
import { ProcessHandlers } from './utils/process-handlers.ts';

const env = validateEnv();
Config.initialize(env);
Logger.initialize('deno');
JwtUtil.initialize(Config.jwtSecret, Config.jwtRefreshSecret);

const db = Database.getInstance();
await db.connect();

const app = new Application();

// Global error handler
app.use(errorHandler);

// Runtime header middleware
app.use(async (ctx, next) => {
  ctx.response.headers.set('X-Runtime', 'deno');
  await next();
});

// Health check endpoint
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === '/health') {
    ctx.response.body = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      runtime: 'deno',
    };
    return;
  }
  await next();
});

// OpenAPI JSON endpoint (with caching headers)
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === '/api-docs.json') {
    ctx.response.type = 'application/json';
    ctx.response.headers.set('Cache-Control', 'public, max-age=3600');
    ctx.response.body = openApiSpec;
    return;
  }
  await next();
});

// Swagger UI endpoint (cached HTML)
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === '/api-docs') {
    ctx.response.type = 'text/html';
    ctx.response.headers.set('Cache-Control', 'public, max-age=3600');
    ctx.response.body = getSwaggerHTML();
    return;
  }
  await next();
});

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(studentRouter.routes());
app.use(studentRouter.allowedMethods());
app.use(classRouter.routes());
app.use(classRouter.allowedMethods());
app.use(gradeRouter.routes());
app.use(gradeRouter.allowedMethods());
app.use(reportRouter.routes());
app.use(reportRouter.allowedMethods());

const PORT = Number(Deno.env.get('PORT')) || 3002;

Logger.info(`Deno API running on port ${Config.port}`, {
  environment: Config.nodeEnv,
  runtime: 'deno',
  swagger: `http://localhost:${Config.port}/api-docs`,
});

// 404 handler - must be after all routes
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = {
    success: false,
    message: 'Resource not found',
    path: ctx.request.url.pathname,
    method: ctx.request.method,
    timestamp: new Date().toISOString(),
  };
});

// Setup process handlers
ProcessHandlers.setupHandlers(db);

console.log(`Swagger UI available at: http://localhost:${Config.port}/api-docs`);
await app.listen({ port: PORT });
