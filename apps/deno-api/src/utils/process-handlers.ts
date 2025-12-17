import { Logger } from '@student-api/shared-logger';
import type { Database } from '../db/connection.ts';

export class ProcessHandlers {
  static setupHandlers(db: Database): void {
    // Handle uncaught exceptions
    globalThis.addEventListener('error', (event) => {
      Logger.error('Uncaught Exception:', {
        error: event.error?.message || String(event.error),
        stack: event.error?.stack,
      });
      event.preventDefault();
    });

    // Handle unhandled promise rejections
    globalThis.addEventListener('unhandledrejection', (event) => {
      Logger.error('Unhandled Rejection:', {
        reason: event.reason instanceof Error ? event.reason.message : String(event.reason),
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
      });
      event.preventDefault();
    });

    // Handle SIGTERM and SIGINT gracefully
    const shutdown = async (signal: string) => {
      Logger.info(`${signal} signal received: closing server`);
      try {
        await db.disconnect();
        Logger.info('MongoDB connection closed');
        Deno.exit(0);
      } catch (error) {
        Logger.error('Error during graceful shutdown:', {
          error: error instanceof Error ? error.message : String(error),
        });
        Deno.exit(1);
      }
    };

    Deno.addSignalListener('SIGTERM', () => shutdown('SIGTERM'));
    Deno.addSignalListener('SIGINT', () => shutdown('SIGINT'));
  }
}
