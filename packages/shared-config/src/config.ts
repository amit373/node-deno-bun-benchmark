import type { Env } from './env.js';

export class Config {
  private static env: Env;

  static initialize(env: Env): void {
    this.env = env;
  }

  static get nodeEnv(): string {
    return this.env.NODE_ENV;
  }

  static get port(): number {
    return this.env.PORT;
  }

  static get mongodbUri(): string {
    return this.env.MONGODB_URI;
  }

  static get jwtSecret(): string {
    return this.env.JWT_SECRET;
  }

  static get jwtRefreshSecret(): string {
    return this.env.JWT_REFRESH_SECRET;
  }

  static get logLevel(): string {
    return this.env.LOG_LEVEL;
  }

  static get corsOrigin(): string {
    return this.env.CORS_ORIGIN;
  }

  static get rateLimitEnabled(): boolean {
    return this.env.RATE_LIMIT_ENABLED;
  }

  static get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }

  static get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }

  static get isTest(): boolean {
    return this.env.NODE_ENV === 'test';
  }
}
