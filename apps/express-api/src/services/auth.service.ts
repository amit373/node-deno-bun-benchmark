import { CryptoUtil, JwtUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES, ROLE_PERMISSIONS } from '@student-api/shared-constants';
import { AppError } from '@student-api/shared-middleware';
import type { AuthTokens, AuthenticatedUser } from '@student-api/shared-types';
import { UserModel } from '../models/index.js';

export class AuthService {
  static async login(email: string, password: string): Promise<AuthTokens> {
    const user = await UserModel.findOne({ email, isActive: true });

    if (!user || !(await CryptoUtil.comparePassword(password, user.password))) {
      throw new AppError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const permissions = ROLE_PERMISSIONS[user.role];
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions,
    };

    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  static refreshToken(refreshToken: string): AuthTokens {
    try {
      const payload = JwtUtil.verifyRefreshToken(refreshToken);
      const permissions = ROLE_PERMISSIONS[payload.role];

      const newPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions,
      };

      const accessToken = JwtUtil.generateAccessToken(newPayload);
      const newRefreshToken = JwtUtil.generateRefreshToken(newPayload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900,
      };
    } catch {
      throw new AppError(401, ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  static async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(404, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role],
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
