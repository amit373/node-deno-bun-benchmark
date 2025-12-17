import 'dotenv/config';
import { Database } from './db/connection.js';
import { UserModel, StudentModel, ClassModel, GradeModel } from './models/index.js';
import { CryptoUtil } from '@student-api/shared-utils';
import { Logger } from '@student-api/shared-logger';
import { validateEnv, Config } from '@student-api/shared-config';

validateEnv();
Config.initialize(validateEnv());
Logger.initialize('node');

async function seed(): Promise<void> {
  try {
    const db = Database.getInstance();
    await db.connect();

    Logger.info('Starting database seed...');

    // Create Admin User
    const adminEmail = 'admin@school.com';
    let admin = await UserModel.findOne({ email: adminEmail });

    if (!admin) {
      admin = await UserModel.create({
        email: adminEmail,
        password: await CryptoUtil.hashPassword('admin123'),
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        isActive: true,
      });
      Logger.info('Admin user created');
    } else {
      Logger.info('Admin user already exists');
    }

    // Create Teacher
    const teacherEmail = 'john.teacher@school.com';
    let teacher = await UserModel.findOne({ email: teacherEmail });

    if (!teacher) {
      teacher = await UserModel.create({
        email: teacherEmail,
        password: await CryptoUtil.hashPassword('teacher123'),
        firstName: 'John',
        lastName: 'Teacher',
        role: 'TEACHER',
        isActive: true,
      });
      Logger.info('Teacher user created');
    } else {
      Logger.info('Teacher user already exists');
    }

    // Create Student Users
    const studentUsers = [
      { email: 'alice.johnson@school.com', firstName: 'Alice', lastName: 'Johnson' },
      { email: 'bob.smith@school.com', firstName: 'Bob', lastName: 'Smith' },
      { email: 'carol.williams@school.com', firstName: 'Carol', lastName: 'Williams' },
    ];

    const createdStudentUsers = [];
    for (const userData of studentUsers) {
      let user = await UserModel.findOne({ email: userData.email });

      if (!user) {
        user = await UserModel.create({
          ...userData,
          password: await CryptoUtil.hashPassword('student123'),
          role: 'STUDENT',
          isActive: true,
        });
        Logger.info(`Student user ${userData.email} created`);
      } else {
        Logger.info(`Student user ${userData.email} already exists`);
      }

      createdStudentUsers.push(user);
    }

    // Create Students
    const students = [];
    for (let i = 0; i < createdStudentUsers.length; i++) {
      const user = createdStudentUsers[i];
      let student = await StudentModel.findOne({ userId: user._id });

      if (!student) {
        student = await StudentModel.create({
          userId: user._id,
          studentId: `STU${String(i + 1).padStart(3, '0')}`,
          dateOfBirth: new Date(2010, i, 15),
          enrollmentDate: new Date(2023, 8, 1),
          grade: '8',
          section: 'A',
        });
        Logger.info(`Student ${student.studentId} created`);
      } else {
        Logger.info(`Student for user ${user.email} already exists`);
      }

      students.push(student);
    }

    // Create Classes
    const classData = [
      {
        name: 'Mathematics 8A',
        code: 'MATH8A',
        subject: 'Mathematics',
        grade: '8',
        academicYear: '2023-2024',
      },
      {
        name: 'Science 8A',
        code: 'SCI8A',
        subject: 'Science',
        grade: '8',
        academicYear: '2023-2024',
      },
      {
        name: 'English 8A',
        code: 'ENG8A',
        subject: 'English',
        grade: '8',
        academicYear: '2023-2024',
      },
    ];

    const classes = [];
    for (const data of classData) {
      let classDoc = await ClassModel.findOne({ code: data.code });

      if (!classDoc) {
        classDoc = await ClassModel.create({
          ...data,
          teacherId: teacher._id,
        });
        Logger.info(`Class ${data.code} created`);
      } else {
        Logger.info(`Class ${data.code} already exists`);
      }

      classes.push(classDoc);
    }

    // Create Sample Grades
    const gradeCount = await GradeModel.countDocuments();

    if (gradeCount === 0) {
      const gradeCategories = ['HOMEWORK', 'QUIZ', 'TEST', 'EXAM', 'PROJECT'] as const;

      for (const student of students) {
        for (const classDoc of classes) {
          // Create 3-5 random grades per student per class
          const numGrades = Math.floor(Math.random() * 3) + 3;

          for (let i = 0; i < numGrades; i++) {
            const category = gradeCategories[Math.floor(Math.random() * gradeCategories.length)];
            const maxScore = category === 'EXAM' ? 100 : category === 'TEST' ? 50 : 20;
            const score = Math.floor(Math.random() * (maxScore * 0.4)) + maxScore * 0.6; // 60-100%
            const percentage = Math.round((score / maxScore) * 100 * 100) / 100;

            let letterGrade = 'F';
            if (percentage >= 97) letterGrade = 'A+';
            else if (percentage >= 93) letterGrade = 'A';
            else if (percentage >= 90) letterGrade = 'A-';
            else if (percentage >= 87) letterGrade = 'B+';
            else if (percentage >= 83) letterGrade = 'B';
            else if (percentage >= 80) letterGrade = 'B-';
            else if (percentage >= 77) letterGrade = 'C+';
            else if (percentage >= 73) letterGrade = 'C';
            else if (percentage >= 70) letterGrade = 'C-';
            else if (percentage >= 60) letterGrade = 'D';

            await GradeModel.create({
              studentId: student._id,
              classId: classDoc._id,
              teacherId: teacher._id,
              assignmentName: `${category} ${i + 1}`,
              category,
              score,
              maxScore,
              percentage,
              letterGrade,
              gradeDate: new Date(
                2024,
                Math.floor(Math.random() * 3),
                Math.floor(Math.random() * 28) + 1
              ),
              comments:
                percentage >= 90
                  ? 'Excellent work!'
                  : percentage >= 80
                    ? 'Good job!'
                    : 'Keep practicing',
            });
          }
        }
      }

      Logger.info('Sample grades created');
    } else {
      Logger.info('Grades already exist');
    }

    Logger.info('Database seed completed successfully!');
    Logger.info(`\nLogin credentials:`);
    Logger.info(`Admin: admin@school.com / admin123`);
    Logger.info(`Teacher: john.teacher@school.com / teacher123`);
    Logger.info(`Student: alice.johnson@school.com / student123`);

    await db.disconnect();
    process.exit(0);
  } catch (error) {
    Logger.error('Seed failed', { error });
    process.exit(1);
  }
}

void seed();
