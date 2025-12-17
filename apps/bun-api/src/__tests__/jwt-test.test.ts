import { describe, test, expect, beforeAll } from 'bun:test';
import { JwtUtil } from '@student-api/shared-utils';
import { UserRole, Permission } from '@student-api/shared-types';

describe('JWT Util Test', () => {
  beforeAll(() => {
    JwtUtil.initialize('test-access-secret-key-min-32-chars', 'test-refresh-secret-key-min-32-chars');
  });

  test('should generate and verify token', () => {
    const payload = {
      userId: '123',
      email: 'test@test.com',
      role: UserRole.SUPER_ADMIN,
      permissions: [] as Permission[],
    };

    const token = JwtUtil.generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const verified = JwtUtil.verifyAccessToken(token);
    expect(verified.userId).toBe('123');
    expect(verified.email).toBe('test@test.com');
  });
});
