import jwt from 'jsonwebtoken';
import type { TokenPayload } from '@student-api/shared-types';
import { APP_CONFIG } from '@student-api/shared-constants';

export class JwtUtil {
  private static accessSecret: string;
  private static refreshSecret: string;

  static initialize(accessSecret: string, refreshSecret: string): void {
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
  }

  static generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: APP_CONFIG.JWT_EXPIRY,
    });
  }

  static generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRY,
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessSecret) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.refreshSecret) as TokenPayload;
  }

  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload | null;
  }
}
