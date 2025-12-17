import { assertEquals, assertExists } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { AuthService } from '../services/auth.service.ts';
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

Deno.test('AuthService - login with valid credentials', async () => {
  await Database.connect();

  const testUser = {
    email: 'test@example.com',
    password: await CryptoUtil.hashPassword('password123'),
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.STUDENT,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await Collections.users().insertOne(testUser);

  const result = await AuthService.login('test@example.com', 'password123');

  assertExists(result.accessToken);
  assertExists(result.refreshToken);
  assertEquals(result.expiresIn, 900);

  await Collections.users().deleteOne({ email: 'test@example.com' });
  await Database.disconnect();
});

Deno.test('AuthService - login with invalid credentials should throw', async () => {
  await Database.connect();

  let errorThrown = false;
  try {
    await AuthService.login('nonexistent@example.com', 'wrongpassword');
  } catch (_error) {
    errorThrown = true;
  }

  assertEquals(errorThrown, true);
  await Database.disconnect();
});

Deno.test('AuthService - getCurrentUser with valid userId', async () => {
  await Database.connect();

  const testUser = {
    email: 'test2@example.com',
    password: await CryptoUtil.hashPassword('password123'),
    firstName: 'Test',
    lastName: 'User2',
    role: UserRole.STUDENT,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertResult = await Collections.users().insertOne(testUser);
  const userId = insertResult.insertedId.toString();

  const user = await AuthService.getCurrentUser(userId);

  assertEquals(user.id, userId);
  assertEquals(user.email, 'test2@example.com');
  assertExists(user.role);
  assertExists(user.firstName);
  assertExists(user.lastName);

  await Collections.users().deleteOne({ _id: insertResult.insertedId });
  await Database.disconnect();
});

Deno.test('AuthService - getCurrentUser with invalid userId should throw', async () => {
  await Database.connect();

  let errorThrown = false;
  try {
    await AuthService.getCurrentUser('507f1f77bcf86cd799439011');
  } catch (_error) {
    errorThrown = true;
  }

  assertEquals(errorThrown, true);
  await Database.disconnect();
});
