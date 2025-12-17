import { z } from 'zod';
import { GradeCategory } from '@student-api/shared-types';

export const CreateGradeSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  classId: z.string().min(1, 'Class ID is required'),
  assignmentName: z.string().min(1, 'Assignment name is required'),
  score: z.number().min(0, 'Score must be non-negative'),
  maxScore: z.number().positive('Max score must be positive'),
  gradeDate: z.string().datetime('Invalid date format'),
  comments: z.string().optional(),
  category: z.nativeEnum(GradeCategory),
});

export const UpdateGradeSchema = z.object({
  score: z.number().min(0, 'Score must be non-negative').optional(),
  maxScore: z.number().positive('Max score must be positive').optional(),
  comments: z.string().optional(),
  category: z.nativeEnum(GradeCategory).optional(),
});
