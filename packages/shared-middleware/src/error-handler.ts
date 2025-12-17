import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Logger } from '@student-api/shared-logger';
import { ResponseFormatter } from '@student-api/shared-utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '@student-api/shared-constants';
import type { ValidationError } from '@student-api/shared-types';
import { AppError } from './error-types.js';
import { MongoDBErrorHandler } from './mongodb-error-handler.js';
import { JWTErrorHandler } from './jwt-error-handler.js';

// Re-export for backward compatibility
export { AppError } from './error-types.js';

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = err as Error & { code?: number | string; keyPattern?: Record<string, number>; errors?: Record<string, unknown>; path?: string; value?: unknown };
  
  Logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    code: error.code,
    name: error.name,
  });

  try {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
      const errors: ValidationError[] = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      }));

      res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(ResponseFormatter.validationError(errors));
      return;
    }

    // Handle MongoDB/Mongoose errors
    if (MongoDBErrorHandler.isMongoError(err)) {
      MongoDBErrorHandler.handle(err as Error & { code?: number; keyPattern?: Record<string, number>; errors?: Record<string, unknown>; path?: string; value?: unknown });
    }

    // Handle JWT errors
    if (JWTErrorHandler.isJWTError(err)) {
      JWTErrorHandler.handle(err);
    }

    // Handle custom AppError
    if (err instanceof AppError) {
      res.status(err.statusCode).json(ResponseFormatter.error(err.message, err.statusCode, err.name));
      return;
    }

    // Default error
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ResponseFormatter.error(
          ERROR_MESSAGES.INTERNAL_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error.message || 'Unknown error'
        )
      );
  } catch (handledError) {
    // If error handlers throw AppError, handle it
    if (handledError instanceof AppError) {
      res
        .status(handledError.statusCode)
        .json(ResponseFormatter.error(handledError.message, handledError.statusCode, handledError.name));
      return;
    }

    // Fallback for unexpected errors
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ResponseFormatter.error(
          ERROR_MESSAGES.INTERNAL_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Unexpected error'
        )
      );
  }
};
