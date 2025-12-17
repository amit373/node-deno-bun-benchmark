import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import {
  authenticate,
  validateRequest,
  validateParams,
  validateQuery,
  checkPermission,
} from '@student-api/shared-middleware';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';

export const studentRouter = Router();

studentRouter.use(authenticate);

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 */
studentRouter.get(
  '/',
  checkPermission(Permission.VIEW_STUDENTS),
  validateQuery(PaginationSchema),
  StudentController.getAll
);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 */
studentRouter.get(
  '/:id',
  checkPermission(Permission.VIEW_STUDENTS),
  validateParams(IdParamSchema),
  StudentController.getById
);

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create new student
 *     tags: [Students]
 */
studentRouter.post(
  '/',
  checkPermission(Permission.MANAGE_STUDENTS),
  validateRequest(CreateStudentSchema),
  StudentController.create
);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     summary: Update student
 *     tags: [Students]
 */
studentRouter.put(
  '/:id',
  checkPermission(Permission.MANAGE_STUDENTS),
  validateParams(IdParamSchema),
  validateRequest(UpdateStudentSchema),
  StudentController.update
);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
 */
studentRouter.delete(
  '/:id',
  checkPermission(Permission.MANAGE_STUDENTS),
  validateParams(IdParamSchema),
  StudentController.delete
);
