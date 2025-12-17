import { CryptoUtil, JwtUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES, ROLE_PERMISSIONS, HTTP_STATUS } from '@student-api/shared-constants';
import type { AuthTokens, AuthenticatedUser, LoginResponse } from '@student-api/shared-types';
import { AppError } from '@student-api/shared-middleware';
import { Collections } from '../models/collections';
import { ObjectId } from 'mongodb';

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    const user = await Collections.users().findOne({ email, isActive: true });

    if (!user || !(await CryptoUtil.comparePassword(password, user.password))) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const permissions = ROLE_PERMISSIONS[user.role];
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions,
    };

    return {
      accessToken: JwtUtil.generateAccessToken(payload),
      refreshToken: JwtUtil.generateRefreshToken(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  static refreshToken(refreshToken: string): AuthTokens {
    const payload = JwtUtil.verifyRefreshToken(refreshToken);
    const permissions = ROLE_PERMISSIONS[payload.role];
    const newPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions,
    };

    return {
      accessToken: JwtUtil.generateAccessToken(newPayload),
      refreshToken: JwtUtil.generateRefreshToken(newPayload),
      expiresIn: 900,
    };
  }

  static async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await Collections.users().findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
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
