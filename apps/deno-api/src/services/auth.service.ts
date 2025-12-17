import * as bcrypt from 'bcrypt';
import { create, verify } from 'djwt';
import { Collections } from '../models/collections.ts';
import { ObjectId } from 'mongodb';
import { AppError } from '@student-api/shared-middleware';
import { HTTP_STATUS, ERROR_MESSAGES } from '@student-api/shared-constants';

const JWT_SECRET =
  Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(JWT_SECRET),
  { name: 'HMAC', hash: 'SHA-512' },
  false,
  ['sign', 'verify']
);

export class AuthService {
  static async login(email: string, password: string) {
    const user = await Collections.users().findOne({ email, isActive: true });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const userId = user._id!.toString();
    const payload = { userId, email: user.email, role: user.role, exp: Date.now() / 1000 + 900 };
    const accessToken = await create({ alg: 'HS512', typ: 'JWT' }, payload, key);
    const refreshToken = await create(
      { alg: 'HS512', typ: 'JWT' },
      { ...payload, exp: Date.now() / 1000 + 604800 },
      key
    );

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  static async refreshToken(refreshToken: string) {
    const payload = await verify(refreshToken, key);
    const newPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      exp: Date.now() / 1000 + 900,
    };
    const accessToken = await create({ alg: 'HS512', typ: 'JWT' }, newPayload, key);
    const newRefreshToken = await create(
      { alg: 'HS512', typ: 'JWT' },
      { ...newPayload, exp: Date.now() / 1000 + 604800 },
      key
    );

    return { accessToken, refreshToken: newRefreshToken, expiresIn: 900 };
  }

  static async getCurrentUser(userId: string) {
    const user = await Collections.users().findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id!.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async getCurrentUserFromToken(token: string) {
    const payload = await verify(token, key);
    return this.getCurrentUser(payload.userId as string);
  }
}
