import { UnauthorizedError } from './error-types.js';

export class JWTErrorHandler {
  static handle(error: Error): never {
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }

    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }

    // Re-throw if not a JWT error
    throw error;
  }

  static isJWTError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as { name?: string };
    return err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError';
  }
}
