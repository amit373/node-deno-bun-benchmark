import { Logger } from '@student-api/shared-logger';
import { MongoDBErrorHandler, JWTErrorHandler, AppError } from '@student-api/shared-middleware';

export interface ElysiaError {
  code?: string;
  error: unknown;
  set: {
    status: number;
  };
}

export class BunErrorHandler {
  static handle({ code, error, set }: ElysiaError): Record<string, unknown> {
    // Type guard to check if error is Error-like
    const isErrorLike = (err: unknown): err is Error => {
      return err !== null && typeof err === 'object' && 'message' in err;
    };

    Logger.error('Error occurred:', {
      code,
      error: isErrorLike(error) ? error.message : String(error),
      stack: isErrorLike(error) ? error.stack : undefined,
      name: isErrorLike(error) ? error.name : undefined,
    });

    try {
      // Handle MongoDB/Mongoose errors
      if (isErrorLike(error) && MongoDBErrorHandler.isMongoError(error)) {
        try {
          MongoDBErrorHandler.handle(error);
        } catch (handledError) {
          if (handledError instanceof AppError) {
            set.status = handledError.statusCode;
            return {
              success: false,
              message: handledError.message,
              error: handledError.name,
              timestamp: new Date().toISOString(),
            };
          }
        }
      }

      // Handle JWT errors
      if (isErrorLike(error) && JWTErrorHandler.isJWTError(error)) {
        try {
          JWTErrorHandler.handle(error);
        } catch (handledError) {
          if (handledError instanceof AppError) {
            set.status = handledError.statusCode;
            return {
              success: false,
              message: handledError.message,
              error: handledError.name,
              timestamp: new Date().toISOString(),
            };
          }
        }
      }

      // Handle custom AppError
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return {
          success: false,
          message: error.message,
          error: error.name,
          timestamp: new Date().toISOString(),
        };
      }

      // Default error
      set.status = code === 'NOT_FOUND' ? 404 : 500;
      return {
        success: false,
        message: code === 'NOT_FOUND' ? 'Resource not found' : 'Internal server error',
        error: isErrorLike(error) ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    } catch (unexpectedError) {
      // Fallback for any unexpected errors
      set.status = 500;
      return {
        success: false,
        message: 'Internal server error',
        error: 'UnexpectedError',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
