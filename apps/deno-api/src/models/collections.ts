import { Collection, ObjectId } from 'mongodb';
import { Database } from '../db/connection.ts';
import { UserRole, GradeCategory } from '@student-api/shared-types';

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentDocument {
  _id?: ObjectId;
  userId: ObjectId;
  studentId: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  grade: string;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassDocument {
  _id?: ObjectId;
  name: string;
  code: string;
  teacherId: ObjectId;
  subject: string;
  grade: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GradeDocument {
  _id?: ObjectId;
  studentId: ObjectId;
  classId: ObjectId;
  teacherId: ObjectId;
  assignmentName: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  gradeDate: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Collections {
  static users(): Collection<UserDocument> {
    return Database.getInstance().getDb().collection<UserDocument>('users');
  }

  static students(): Collection<StudentDocument> {
    return Database.getInstance().getDb().collection<StudentDocument>('students');
  }

  static classes(): Collection<ClassDocument> {
    return Database.getInstance().getDb().collection<ClassDocument>('classes');
  }

  static grades(): Collection<GradeDocument> {
    return Database.getInstance().getDb().collection<GradeDocument>('grades');
  }

  static async createIndexes(): Promise<void> {
    await this.users().createIndex({ email: 1 }, { unique: true });
    await this.users().createIndex({ role: 1 });

    await this.students().createIndex({ userId: 1 });
    await this.students().createIndex({ studentId: 1 }, { unique: true });
    await this.students().createIndex({ grade: 1, section: 1 });

    await this.classes().createIndex({ code: 1 }, { unique: true });
    await this.classes().createIndex({ teacherId: 1 });
    await this.classes().createIndex({ grade: 1, academicYear: 1 });

    await this.grades().createIndex({ studentId: 1, classId: 1 });
    await this.grades().createIndex({ classId: 1 });
    await this.grades().createIndex({ teacherId: 1 });
    await this.grades().createIndex({ gradeDate: -1 });
  }
}
