import type { TimestampFields } from './common.types.js';

export interface Student extends TimestampFields {
  id: string;
  userId: string;
  studentId: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  grade: string;
  section?: string;
  parentId?: string;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
}

export interface CreateStudentDto {
  userId: string;
  studentId: string;
  dateOfBirth: string;
  enrollmentDate: string;
  grade: string;
  section?: string;
  parentId?: string;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
}

export interface UpdateStudentDto {
  grade?: string;
  section?: string;
  address?: string;
  phoneNumber?: string;
  emergencyContact?: string;
}

export interface StudentWithUser extends Student {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
