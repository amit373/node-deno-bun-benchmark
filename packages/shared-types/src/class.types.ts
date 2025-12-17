import type { TimestampFields } from './common.types.js';

export interface Class extends TimestampFields {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId: string;
  subject: string;
  grade: string;
  section?: string;
  schedule?: string;
  maxStudents?: number;
  academicYear: string;
}

export interface CreateClassDto {
  name: string;
  code: string;
  description?: string;
  teacherId: string;
  subject: string;
  grade: string;
  section?: string;
  schedule?: string;
  maxStudents?: number;
  academicYear: string;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  teacherId?: string;
  schedule?: string;
  maxStudents?: number;
}

export interface ClassEnrollment extends TimestampFields {
  id: string;
  classId: string;
  studentId: string;
  enrollmentDate: Date;
  status: 'active' | 'dropped' | 'completed';
}
