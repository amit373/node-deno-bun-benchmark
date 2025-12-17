import pino from 'pino';

export class Logger {
  private static instance: pino.Logger;

  static initialize(runtime: 'node' | 'deno' | 'bun'): void {
    this.instance = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      base: {
        runtime,
      },
      redact: {
        paths: ['password', 'token', 'accessToken', 'refreshToken', 'authorization'],
        remove: true,
      },
    });
  }

  static info(message: string, data?: Record<string, unknown>): void {
    if (!this.instance) this.initialize('node');
    this.instance.info(data, message);
  }

  static error(message: string, error?: Error | Record<string, unknown>): void {
    if (!this.instance) this.initialize('node');
    this.instance.error(error, message);
  }

  static warn(message: string, data?: Record<string, unknown>): void {
    if (!this.instance) this.initialize('node');
    this.instance.warn(data, message);
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    if (!this.instance) this.initialize('node');
    this.instance.debug(data, message);
  }

  static child(bindings: Record<string, unknown>): pino.Logger {
    return this.instance.child(bindings);
  }
}
