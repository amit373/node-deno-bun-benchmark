import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { StudentService } from '../services/student.service';
import { Database } from '../db/connection';
import { Collections } from '../models/collections';
import { CryptoUtil, JwtUtil } from '@student-api/shared-utils';
import { UserRole } from '@student-api/shared-types';
import { Logger } from '@student-api/shared-logger';
import { Config, validateEnv } from '@student-api/shared-config';

describe('StudentService', () => {
  let testUserId: string;

  beforeAll(async () => {
    Logger.initialize('bun');
    const env = validateEnv();
    Config.initialize(env);
    JwtUtil.initialize(env.JWT_SECRET, env.JWT_REFRESH_SECRET);
    const db = Database.getInstance();
    await db.connect();
  });

  beforeEach(async () => {
    await Collections.users().deleteMany({ email: /test@example.com/ });
    await Collections.students().deleteMany({ studentId: /TEST/ });
    
    const testUser = {
      email: 'student.test@example.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Student',
      lastName: 'Test',
      role: UserRole.STUDENT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.users().insertOne(testUser);
    testUserId = result.insertedId.toString();
  });

  afterAll(async () => {
    await Collections.users().deleteMany({ email: /test@example.com/ });
    await Collections.students().deleteMany({ studentId: /TEST/ });
    const db = Database.getInstance();
    await db.disconnect();
  });

  describe('create', () => {
    test('should create a new student', async () => {
      const studentData = {
        userId: testUserId,
        studentId: 'TEST001',
        dateOfBirth: '2010-01-01',
        enrollmentDate: '2023-09-01',
        grade: '8',
        section: 'A',
      };

      const student = await StudentService.create(studentData);

      expect(student).toHaveProperty('id');
      expect(student.studentId).toBe('TEST001');
      expect(student.grade).toBe('8');
      expect(student.section).toBe('A');
    });
  });

  describe('getAll', () => {
    test('should return paginated students', async () => {
      const result = await StudentService.getAll({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
