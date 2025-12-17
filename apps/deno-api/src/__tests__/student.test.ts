import { assertEquals, assertExists } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { StudentService } from '../services/student.service.ts';
import { Database } from '../db/connection.ts';
import { Collections } from '../models/collections.ts';
import { CryptoUtil } from '@student-api/shared-utils';
import { UserRole } from '@student-api/shared-types';
import { Logger } from '@student-api/shared-logger';
import { Config, validateEnv } from '@student-api/shared-config';

// Initialize Logger and Config
Logger.initialize('deno');
const env = validateEnv();
Config.initialize(env);

Deno.test('StudentService - create new student', async () => {
  await Database.connect();

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

  const userResult = await Collections.users().insertOne(testUser);
  const testUserId = userResult.insertedId.toString();

  const studentData = {
    userId: testUserId,
    studentId: 'TEST001',
    dateOfBirth: new Date('2010-01-01'),
    enrollmentDate: new Date('2023-09-01'),
    grade: '8',
    section: 'A',
  };

  const student = await StudentService.create(studentData);

  assertExists(student.id);
  assertEquals(student.studentId, 'TEST001');
  assertEquals(student.grade, '8');
  assertEquals(student.section, 'A');

  await Collections.students().deleteOne({ studentId: 'TEST001' });
  await Collections.users().deleteOne({ _id: userResult.insertedId });
  await Database.disconnect();
});

Deno.test('StudentService - getAll returns paginated results', async () => {
  await Database.connect();

  const result = await StudentService.getAll({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  assertExists(result.data);
  assertExists(result.pagination);
  assertEquals(Array.isArray(result.data), true);

  await Database.disconnect();
});
