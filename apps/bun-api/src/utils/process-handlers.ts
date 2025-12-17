import { Logger } from '@student-api/shared-logger';
import type { Database } from '../db/connection';

export class ProcessHandlers {
  static setupHandlers(server: { stop: () => Promise<unknown> }, db: Database): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      Logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
      });
      // Give time to log before exiting
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      Logger.error('Unhandled Rejection:', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    });

    // Handle SIGTERM gracefully
    process.on('SIGTERM', () => {
      Logger.info('SIGTERM signal received: closing server');
      void server.stop().then(() => {
        Logger.info('Server closed');
        return db.disconnect();
      }).then(() => {
        Logger.info('MongoDB connection closed');
        process.exit(0);
      }).catch((error) => {
        Logger.error('Error during graceful shutdown:', {
          error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      });
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      Logger.info('SIGINT signal received: closing server');
      void server.stop().then(() => {
        Logger.info('Server closed');
        return db.disconnect();
      }).then(() => {
        Logger.info('MongoDB connection closed');
        process.exit(0);
      }).catch((error) => {
        Logger.error('Error during graceful shutdown:', {
          error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      });
    });
  }
}
