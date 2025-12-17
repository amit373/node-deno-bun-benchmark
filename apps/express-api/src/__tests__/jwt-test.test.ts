import { JwtUtil } from '@student-api/shared-utils';

describe('JWT Util Test', () => {
  test('should generate and verify token', () => {
    const payload = {
      userId: '123',
      email: 'test@test.com',
      role: 'SUPER_ADMIN' as const,
      permissions: [],
    };

    const token = JwtUtil.generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const verified = JwtUtil.verifyAccessToken(token);
    expect(verified.userId).toBe('123');
    expect(verified.email).toBe('test@test.com');
  });
});
