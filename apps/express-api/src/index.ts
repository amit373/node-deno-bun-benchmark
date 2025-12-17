import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { Config, validateEnv } from '@student-api/shared-config';
import { Logger } from '@student-api/shared-logger';
import { errorHandler } from '@student-api/shared-middleware';
import { JwtUtil } from '@student-api/shared-utils';
import { Database } from './db/connection.js';
import { APP_CONFIG } from '@student-api/shared-constants';
import { getSwaggerSpec } from './config/swagger.js';
import { router } from './routes/index.js';
import { ProcessHandlers } from './middleware/process-handlers.js';

validateEnv();
Config.initialize(validateEnv());
Logger.initialize('node');

const db = Database.getInstance();
await db.connect();
JwtUtil.initialize(Config.jwtSecret, Config.jwtRefreshSecret);

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: Config.corsOrigin,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (Config.rateLimitEnabled) {
  const limiter = rateLimit({
    windowMs: APP_CONFIG.RATE_LIMIT_WINDOW_MS,
    max: APP_CONFIG.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
}

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(getSwaggerSpec(), {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Student API Documentation',
  })
);

app.use('/api', router);

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    runtime: 'node',
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler - must be last
app.use(errorHandler);

const PORT = Config.port;

const server = app.listen(PORT, () => {
  Logger.info(`Express API running on port ${PORT}`, {
    environment: Config.nodeEnv,
    runtime: 'node',
  });
});

// Setup process handlers
ProcessHandlers.setupHandlers(server, db);
