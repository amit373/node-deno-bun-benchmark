import { AuthService } from '@services/auth.service';
import { Database } from '@/db/connection';
import { UserModel } from '@/models/user.model';
import { CryptoUtil, JwtUtil } from '@student-api/shared-utils';
import { UserRole } from '@student-api/shared-types';

describe('AuthService', () => {
  let testUserId: string;

  beforeAll(async () => {
    JwtUtil.initialize('test-access-secret-key-min-32-chars', 'test-refresh-secret-key-min-32-chars');
    const db = Database.getInstance();
    await db.connect();

    // Create test user
    const testUser = await UserModel.create({
      email: 'admin@school.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });
    testUserId = testUser._id.toString();
  }, 30000);

  afterAll(async () => {
    await UserModel.deleteMany({ email: { $in: ['admin@school.com', 'nonexistent@school.com'] } });
    const db = Database.getInstance();
    await db.disconnect();
  }, 30000);
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const result = await AuthService.login('admin@school.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresIn');
      expect(result.expiresIn).toBe(900);
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    }, 10000);

    it('should throw error for invalid credentials', async () => {
      await expect(AuthService.login('admin@school.com', 'wrongpassword')).rejects.toThrow();
    }, 10000);

    it('should throw error for non-existent user', async () => {
      await expect(AuthService.login('nonexistent@school.com', 'password123')).rejects.toThrow();
    }, 10000);
  });

  describe('getCurrentUser', () => {
    it('should return user details for valid userId', async () => {
      const userId = testUserId;
      const user = await AuthService.getCurrentUser(userId);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('permissions');
    }, 10000);

    it('should throw error for invalid userId', async () => {
      await expect(AuthService.getCurrentUser('invalid-id')).rejects.toThrow();
    }, 10000);
  });
});
