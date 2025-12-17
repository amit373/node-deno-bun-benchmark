import type { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '@student-api/shared-utils';
import type { TokenPayload } from '@student-api/shared-types';
import { HTTP_STATUS, ERROR_MESSAGES } from '@student-api/shared-constants';
import { AppError } from './error-handler.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_EXPIRED));
    } else if (error instanceof Error && error.name === 'JsonWebTokenError') {
      next(new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_INVALID));
    } else {
      next(error);
    }
  }
};
