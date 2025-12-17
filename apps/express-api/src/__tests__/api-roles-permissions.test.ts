import request from 'supertest';
import express from 'express';
import { Database } from '@/db/connection';
import { authRouter } from '@/routes/auth.routes';
import { classRouter } from '@/routes/class.routes';
import { gradeRouter } from '@/routes/grade.routes';
import { studentRouter } from '@/routes/student.routes';
import { reportRouter } from '@/routes/report.routes';
import { errorHandler } from '@student-api/shared-middleware';
import { UserModel, StudentModel, ClassModel, GradeModel } from '@/models/index';
import { CryptoUtil } from '@student-api/shared-utils';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/grades', gradeRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/reports', reportRouter);
app.use(errorHandler);

describe('Express API - Roles and Permissions Tests', () => {
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;
  let adminUserId: string;
  let teacherUserId: string;
  let studentUserId: string;
  let testClassId: string;
  let testStudentId: string;
  let testGradeId: string;

  beforeAll(async () => {
    const db = Database.getInstance();
    await db.connect();

    // Create test users
    const adminUser = await UserModel.create({
      email: 'test-admin@test.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Test',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    adminUserId = adminUser._id.toString();

    const teacherUser = await UserModel.create({
      email: 'test-teacher@test.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Test',
      lastName: 'Teacher',
      role: 'TEACHER',
      isActive: true,
    });
    teacherUserId = teacherUser._id.toString();

    const studentUser = await UserModel.create({
      email: 'test-student@test.com',
      password: await CryptoUtil.hashPassword('password123'),
      firstName: 'Test',
      lastName: 'Student',
      role: 'STUDENT',
      isActive: true,
    });
    studentUserId = studentUser._id.toString();

    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test-admin@test.com', password: 'password123' });
    adminToken = adminLogin.body.data.accessToken;

    const teacherLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test-teacher@test.com', password: 'password123' });
    teacherToken = teacherLogin.body.data.accessToken;

    const studentLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test-student@test.com', password: 'password123' });
    studentToken = studentLogin.body.data.accessToken;

    // Create test data
    const testStudent = await StudentModel.create({
      userId: studentUserId,
      studentId: 'TEST001',
      dateOfBirth: new Date('2010-01-01'),
      enrollmentDate: new Date('2023-09-01'),
      grade: '8',
      section: 'A',
    });
    testStudentId = testStudent._id.toString();

    const testClass = await ClassModel.create({
      name: 'Test Class',
      code: 'TEST101',
      subject: 'Testing',
      grade: '8',
      teacherId: teacherUserId,
      academicYear: '2023-2024',
    });
    testClassId = testClass._id.toString();

    const testGrade = await GradeModel.create({
      studentId: testStudentId,
      classId: testClassId,
      teacherId: teacherUserId,
      assignmentName: 'Test Assignment',
      category: 'HOMEWORK',
      score: 85,
      maxScore: 100,
      percentage: 85,
      letterGrade: 'B',
      gradeDate: new Date(),
    });
    testGradeId = testGrade._id.toString();
  }, 30000);

  afterAll(async () => {
    try {
      await UserModel.deleteMany({ email: { $regex: /^test-/ } });
      await StudentModel.deleteMany({ studentId: 'TEST001' });
      await ClassModel.deleteMany({ code: 'TEST101' });
      await GradeModel.deleteMany({ assignmentName: 'Test Assignment' });
      
      const db = Database.getInstance();
      await db.disconnect();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 30000);

  describe('Auth Endpoints', () => {
    test('POST /api/v1/auth/login - should login successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test-admin@test.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    test('POST /api/v1/auth/login - should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test-admin@test.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    test('GET /api/v1/auth/me - should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email', 'test-admin@test.com');
      expect(response.body.data).toHaveProperty('role', 'SUPER_ADMIN');
    });

    test('GET /api/v1/auth/me - should fail without token', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('Class Endpoints - Permission Tests', () => {
    test('GET /api/v1/classes - SUPER_ADMIN should view classes', async () => {
      const response = await request(app)
        .get('/api/v1/classes')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test('GET /api/v1/classes - TEACHER should view classes', async () => {
      const response = await request(app)
        .get('/api/v1/classes')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test('GET /api/v1/classes - STUDENT should view classes', async () => {
      const response = await request(app)
        .get('/api/v1/classes')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test('POST /api/v1/classes - SUPER_ADMIN should create class', async () => {
      const response = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Test Class',
          code: 'NEWTEST101',
          subject: 'Testing',
          grade: '9',
          teacherId: teacherUserId,
          academicYear: '2023-2024',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('name', 'New Test Class');

      // Cleanup
      await ClassModel.deleteOne({ code: 'NEWTEST101' });
    });

    test('POST /api/v1/classes - TEACHER should NOT create class', async () => {
      const response = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Unauthorized Class',
          code: 'UNAUTH101',
          subject: 'Testing',
          grade: '9',
          teacherId: teacherUserId,
          academicYear: '2023-2024',
        });

      expect(response.status).toBe(403);
    });

    test('POST /api/v1/classes - STUDENT should NOT create class', async () => {
      const response = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Unauthorized Class',
          code: 'UNAUTH102',
          subject: 'Testing',
          grade: '9',
          teacherId: teacherUserId,
          academicYear: '2023-2024',
        });

      expect(response.status).toBe(403);
    });

    test('PUT /api/v1/classes/:id - SUPER_ADMIN should update class', async () => {
      const response = await request(app)
        .put(`/api/v1/classes/${testClassId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Test Class' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('name', 'Updated Test Class');
    });

    test('PUT /api/v1/classes/:id - TEACHER should NOT update class', async () => {
      const response = await request(app)
        .put(`/api/v1/classes/${testClassId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ name: 'Unauthorized Update' });

      expect(response.status).toBe(403);
    });

    test('DELETE /api/v1/classes/:id - STUDENT should NOT delete class', async () => {
      const response = await request(app)
        .delete(`/api/v1/classes/${testClassId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Student Endpoints - Permission Tests', () => {
    test('GET /api/v1/students - SUPER_ADMIN should view students', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test('GET /api/v1/students - TEACHER should view students', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    test('GET /api/v1/students - STUDENT should NOT view all students', async () => {
      const response = await request(app)
        .get('/api/v1/students')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    test('POST /api/v1/students - SUPER_ADMIN should create student', async () => {
      const newUser = await UserModel.create({
        email: 'test-newstudent@test.com',
        password: await CryptoUtil.hashPassword('password123'),
        firstName: 'New',
        lastName: 'Student',
        role: 'STUDENT',
        isActive: true,
      });

      const response = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: newUser._id.toString(),
          studentId: 'NEWSTU001',
          dateOfBirth: new Date('2010-01-01').toISOString(),
          enrollmentDate: new Date('2023-09-01').toISOString(),
          grade: '8',
          section: 'B',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('studentId', 'NEWSTU001');

      // Cleanup
      await StudentModel.deleteOne({ studentId: 'NEWSTU001' });
      await UserModel.deleteOne({ email: 'test-newstudent@test.com' });
    });

    test('POST /api/v1/students - TEACHER should NOT create student', async () => {
      const response = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          userId: studentUserId,
          studentId: 'UNAUTH001',
          dateOfBirth: '2010-01-01',
          enrollmentDate: '2023-09-01',
          grade: '8',
        });

      expect(response.status).toBe(403);
    });

    test('PUT /api/v1/students/:id - SUPER_ADMIN should update student', async () => {
      const response = await request(app)
        .put(`/api/v1/students/${testStudentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ section: 'B' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('section', 'B');
    });

    test('DELETE /api/v1/students/:id - TEACHER should NOT delete student', async () => {
      const response = await request(app)
        .delete(`/api/v1/students/${testStudentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Grade Endpoints - Permission Tests', () => {
    test('GET /api/v1/grades/student/:id - SUPER_ADMIN should view student grades', async () => {
      const response = await request(app)
        .get(`/api/v1/grades/student/${testStudentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/v1/grades/student/:id - TEACHER should view student grades', async () => {
      const response = await request(app)
        .get(`/api/v1/grades/student/${testStudentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/v1/grades - SUPER_ADMIN should create grade', async () => {
      const response = await request(app)
        .post('/api/v1/grades')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          studentId: testStudentId,
          classId: testClassId,
          assignmentName: 'New Test Grade',
          score: 90,
          maxScore: 100,
          gradeDate: new Date().toISOString(),
          category: 'QUIZ',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('assignmentName', 'New Test Grade');

      // Cleanup
      await GradeModel.deleteOne({ assignmentName: 'New Test Grade' });
    });

    test('POST /api/v1/grades - TEACHER should create grade', async () => {
      const response = await request(app)
        .post('/api/v1/grades')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          studentId: testStudentId,
          classId: testClassId,
          assignmentName: 'Teacher Test Grade',
          score: 88,
          maxScore: 100,
          gradeDate: new Date().toISOString(),
          category: 'QUIZ',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('assignmentName', 'Teacher Test Grade');

      // Cleanup
      await GradeModel.deleteOne({ assignmentName: 'Teacher Test Grade' });
    });

    test('POST /api/v1/grades - STUDENT should NOT create grade', async () => {
      const response = await request(app)
        .post('/api/v1/grades')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          studentId: testStudentId,
          classId: testClassId,
          assignmentName: 'Unauthorized Grade',
          score: 100,
          maxScore: 100,
          gradeDate: new Date().toISOString(),
          category: 'EXAM',
        });

      expect(response.status).toBe(403);
    });

    test('PUT /api/v1/grades/:id - TEACHER should update grade', async () => {
      const response = await request(app)
        .put(`/api/v1/grades/${testGradeId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ score: 95, comments: 'Great improvement!' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('score', 95);
    });

    test('PUT /api/v1/grades/:id - STUDENT should NOT update grade', async () => {
      const response = await request(app)
        .put(`/api/v1/grades/${testGradeId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ score: 100 });

      expect(response.status).toBe(403);
    });

    test('DELETE /api/v1/grades/:id - SUPER_ADMIN should delete grade', async () => {
      const tempGrade = await GradeModel.create({
        studentId: testStudentId,
        classId: testClassId,
        teacherId: teacherUserId,
        assignmentName: 'Temp Grade',
        category: 'QUIZ',
        score: 80,
        maxScore: 100,
        percentage: 80,
        letterGrade: 'B-',
        gradeDate: new Date(),
      });

      const response = await request(app)
        .delete(`/api/v1/grades/${tempGrade._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    test('DELETE /api/v1/grades/:id - STUDENT should NOT delete grade', async () => {
      const response = await request(app)
        .delete(`/api/v1/grades/${testGradeId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Report Endpoints - Permission Tests', () => {
    test('GET /api/v1/reports/students/:id - SUPER_ADMIN should view student report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/students/${testStudentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('studentName');
        expect(response.body.data[0]).toHaveProperty('grades');
      }
    });

    test('GET /api/v1/reports/students/:id - TEACHER should view student report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/students/${testStudentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/v1/reports/students/:id - STUDENT should NOT view report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/students/${testStudentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    test('GET /api/v1/reports/performance/:id - SUPER_ADMIN should view performance report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/performance/${testStudentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('overallGPA');
      expect(response.body.data).toHaveProperty('totalClasses');
      expect(response.body.data).toHaveProperty('reports');
    });

    test('GET /api/v1/reports/performance/:id - TEACHER should view performance report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/performance/${testStudentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('overallGPA');
      expect(response.body.data).toHaveProperty('totalClasses');
    });

    test('GET /api/v1/reports/performance/:id - STUDENT should NOT view performance report', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/performance/${testStudentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Unauthenticated Access Tests', () => {
    test('GET /api/v1/classes - should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/classes');
      expect(response.status).toBe(401);
    });

    test('GET /api/v1/students - should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/students');
      expect(response.status).toBe(401);
    });

    test('GET /api/v1/grades/student/123 - should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/grades/student/123');
      expect(response.status).toBe(401);
    });

    test('GET /api/v1/reports/students/123 - should fail without authentication', async () => {
      const response = await request(app).get('/api/v1/reports/students/123');
      expect(response.status).toBe(401);
    });
  });
});
