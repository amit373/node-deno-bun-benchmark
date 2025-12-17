import { Logger } from '@student-api/shared-logger';
import type { Server } from 'http';
import type { Database } from '../db/connection.js';

export class ProcessHandlers {
  static setupHandlers(server: Server, db: Database): void {
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
      Logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        Logger.info('HTTP server closed');
        db.disconnect()
          .then(() => {
            Logger.info('MongoDB connection closed');
            process.exit(0);
          })
          .catch((error) => {
            Logger.error('Error during graceful shutdown:', {
              error: error instanceof Error ? error.message : String(error),
            });
            process.exit(1);
          });
      });
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      Logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        Logger.info('HTTP server closed');
        db.disconnect()
          .then(() => {
            Logger.info('MongoDB connection closed');
            process.exit(0);
          })
          .catch((error) => {
            Logger.error('Error during graceful shutdown:', {
              error: error instanceof Error ? error.message : String(error),
            });
            process.exit(1);
          });
      });
    });
  }
}
