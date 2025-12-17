import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { AuthService } from '../services/auth.service';
import { Database } from '../db/connection';
import { JwtUtil, CryptoUtil } from '@student-api/shared-utils';
import { Collections } from '../models/collections';
import { UserRole } from '@student-api/shared-types';
import { Logger } from '@student-api/shared-logger';
import { Config, validateEnv } from '@student-api/shared-config';

describe('AuthService', () => {
  let testUserId: string;

  beforeAll(async () => {
    Logger.initialize('bun');
    const env = validateEnv();
    Config.initialize(env);
    JwtUtil.initialize(env.JWT_SECRET, env.JWT_REFRESH_SECRET);
    const db = Database.getInstance();
    await db.connect();

    // Create test user
    const result = await Collections.users().insertOne({
      email: 'admin@school.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testUserId = result.insertedId.toString();
  });

  afterAll(async () => {
    await Collections.users().deleteMany({ email: { $in: ['admin@school.com', 'nonexistent@school.com'] } });
    const db = Database.getInstance();
    await db.disconnect();
  });
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const result = await AuthService.login('admin@school.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email', 'admin@school.com');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });

    it('should throw error for invalid credentials', async () => {
      expect(AuthService.login('admin@school.com', 'wrongpassword')).rejects.toThrow();
    });

    it('should throw error for non-existent user', async () => {
      expect(AuthService.login('nonexistent@school.com', 'password123')).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user details for valid userId', async () => {
      const userId = testUserId;
      const user = await AuthService.getCurrentUser(userId);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('permissions');
    });

    it('should throw error for invalid userId', async () => {
      expect(AuthService.getCurrentUser('invalid-id')).rejects.toThrow();
    });
  });
});
