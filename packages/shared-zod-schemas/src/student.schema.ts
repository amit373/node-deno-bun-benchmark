import { z } from 'zod';

export const CreateStudentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  dateOfBirth: z.string().datetime('Invalid date format'),
  enrollmentDate: z.string().datetime('Invalid date format'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().optional(),
  parentId: z.string().min(1, 'Parent ID is required').optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const UpdateStudentSchema = z.object({
  grade: z.string().min(1, 'Grade is required').optional(),
  section: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
});
