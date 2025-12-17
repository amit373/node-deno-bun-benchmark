import { Context } from 'oak';
import { Logger } from '@student-api/shared-logger';
import { HTTP_STATUS } from '@student-api/shared-constants';
import { MongoDBErrorHandler, JWTErrorHandler, AppError } from '@student-api/shared-middleware';

export const errorHandler = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    await next();
  } catch (err: any) {
    Logger.error('Error occurred:', {
      error: err.message,
      stack: err.stack,
      path: ctx.request.url.pathname,
      method: ctx.request.method,
      code: err.code,
      name: err.name,
    });

    try {
      // Handle MongoDB/Mongoose errors
      if (MongoDBErrorHandler.isMongoError(err)) {
        try {
          MongoDBErrorHandler.handle(err);
        } catch (handledError) {
          if (handledError instanceof AppError) {
            ctx.response.status = handledError.statusCode;
            ctx.response.body = {
              success: false,
              message: handledError.message,
              error: handledError.name,
              timestamp: new Date().toISOString(),
            };
            return;
          }
        }
      }

      // Handle JWT errors
      if (JWTErrorHandler.isJWTError(err)) {
        try {
          JWTErrorHandler.handle(err);
        } catch (handledError) {
          if (handledError instanceof AppError) {
            ctx.response.status = handledError.statusCode;
            ctx.response.body = {
              success: false,
              message: handledError.message,
              error: handledError.name,
              timestamp: new Date().toISOString(),
            };
            return;
          }
        }
      }

      // Handle custom AppError
      if (err instanceof AppError) {
        ctx.response.status = err.statusCode;
        ctx.response.body = {
          success: false,
          message: err.message,
          error: err.name,
          timestamp: new Date().toISOString(),
        };
        return;
      }

      // Default error
      ctx.response.status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      ctx.response.body = {
        success: false,
        message: err.message || 'Internal server error',
        error: err.name,
        timestamp: new Date().toISOString(),
      };
    } catch (unexpectedError) {
      // Fallback for any unexpected errors
      ctx.response.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      ctx.response.body = {
        success: false,
        message: 'Internal server error',
        error: 'UnexpectedError',
        timestamp: new Date().toISOString(),
      };
    }
  }
};
