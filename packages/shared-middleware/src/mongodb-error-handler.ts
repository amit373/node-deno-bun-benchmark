import { ConflictError, BadRequestError, ServiceUnavailableError } from './error-types.js';

export interface MongoDBError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
  errors?: Record<string, unknown>;
  path?: string;
  value?: unknown;
}

export class MongoDBErrorHandler {
  static handle(error: MongoDBError): never {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      throw new ConflictError(`Duplicate value for ${field}. This ${field} already exists.`);
    }

    // Document validation error
    if (error.code === 121) {
      throw new BadRequestError('Document validation failed');
    }

    // Network/Timeout errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      throw new ServiceUnavailableError('Database connection error. Please try again later.');
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {})
        .map((e: unknown) => (e && typeof e === 'object' && 'message' in e ? (e as { message: string }).message : ''))
        .filter(Boolean)
        .join(', ');
      throw new BadRequestError(messages || 'Validation failed');
    }

    // Mongoose cast error (invalid ObjectId, etc.)
    if (error.name === 'CastError') {
      throw new BadRequestError(`Invalid ${error.path}: ${String(error.value)}`);
    }

    // Re-throw if not a MongoDB error
    throw error;
  }

  static isMongoError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as { name?: string; code?: number };
    return (
      err.name === 'MongoError' ||
      err.name === 'MongoServerError' ||
      err.name === 'MongoNetworkError' ||
      err.name === 'MongoTimeoutError' ||
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.code === 11000 ||
      err.code === 121
    );
  }
}
