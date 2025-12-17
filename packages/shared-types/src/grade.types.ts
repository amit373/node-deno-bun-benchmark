import type { TimestampFields } from './common.types.js';

export interface Grade extends TimestampFields {
  id: string;
  studentId: string;
  classId: string;
  teacherId: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  gradeDate: Date;
  comments?: string;
  category: GradeCategory;
}

export enum GradeCategory {
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  PROJECT = 'PROJECT',
  PARTICIPATION = 'PARTICIPATION',
}

export interface CreateGradeDto {
  studentId: string;
  classId: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  gradeDate: string;
  comments?: string;
  category: GradeCategory;
}

export interface UpdateGradeDto {
  score?: number;
  maxScore?: number;
  comments?: string;
  category?: GradeCategory;
}

export interface GradeReport {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  grades: Grade[];
  averageScore: number;
  averagePercentage: number;
  letterGrade: string;
}
