// Simple API test script for Bun API
// Run with: bun test-api.ts

const BASE_URL = 'http://localhost:3001';

interface TestResult {
  name: string;
  passed: boolean;
  status?: number;
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`✅ ${name}`);
  } catch (error: any) {
    results.push({ name, passed: false, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data.accessToken;
}

// Main test suite
async function runTests() {
  console.log('🚀 Starting Bun API Tests...\n');

  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;

  // Login tests
  await test('Login as admin', async () => {
    adminToken = await login('admin@school.com', 'admin123');
    if (!adminToken) throw new Error('No token received');
  });

  await test('Login as teacher', async () => {
    teacherToken = await login('john.teacher@school.com', 'teacher123');
    if (!teacherToken) throw new Error('No token received');
  });

  await test('Login as student', async () => {
    studentToken = await login('alice.johnson@school.com', 'student123');
    if (!studentToken) throw new Error('No token received');
  });

  await test('Login with invalid credentials should fail', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@school.com', password: 'wrongpassword123' }),
    });
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  // Auth /me endpoint
  await test('GET /me with valid token', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
    const data = await response.json();
    if (data.data.email !== 'admin@school.com') {
      throw new Error('Wrong user data');
    }
  });

  await test('GET /me without token should fail', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`);
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  // Class endpoints
  await test('SUPER_ADMIN can view classes', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/classes`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });

  await test('TEACHER can view classes', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/classes`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` },
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });

  await test('STUDENT can view classes', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/classes`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });

  await test('TEACHER cannot create class (403)', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/classes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Class',
        code: 'TEST101',
        subject: 'Test',
        grade: '10',
        academicYear: '2023-2024',
      }),
    });
    if (response.status !== 403) {
      throw new Error(`Expected 403, got ${response.status}`);
    }
  });

  // Student endpoints
  await test('SUPER_ADMIN can view students', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/students`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });

  await test('TEACHER can view students', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/students`, {
      headers: { 'Authorization': `Bearer ${teacherToken}` },
    });
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }
  });

  await test('STUDENT cannot view all students (403)', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/students`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    if (response.status !== 403) {
      throw new Error(`Expected 403, got ${response.status}`);
    }
  });

  await test('TEACHER cannot create student (403)', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${teacherToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: 'TEST001',
        grade: '10',
        section: 'A',
      }),
    });
    if (response.status !== 403) {
      throw new Error(`Expected 403, got ${response.status}`);
    }
  });

  // Unauthenticated access
  await test('Unauthenticated access to classes should fail (401)', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/classes`);
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  await test('Unauthenticated access to students should fail (401)', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/students`);
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`);
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log(`\n📊 Test Results:`);
  console.log(`   Total:  ${total}`);
  console.log(`   Passed: ${passed} ✅`);
  console.log(`   Failed: ${failed} ❌`);
  console.log(`   Success Rate: ${percentage}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(50));
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Bun API: 100%\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review.\n');
    process.exit(1);
  }
}

runTests();
