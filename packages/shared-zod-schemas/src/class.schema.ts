import { z } from 'zod';

export const CreateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  code: z.string().min(1, 'Class code is required'),
  description: z.string().optional(),
  teacherId: z.string().min(1, 'Teacher ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().optional(),
  schedule: z.string().optional(),
  maxStudents: z.number().int().positive().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
});

export const UpdateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').optional(),
  description: z.string().optional(),
  teacherId: z.string().min(1, 'Teacher ID is required').optional(),
  schedule: z.string().optional(),
  maxStudents: z.number().int().positive().optional(),
});
