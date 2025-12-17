import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller.js';
import {
  authenticate,
  validateRequest,
  validateParams,
  checkPermission,
} from '@student-api/shared-middleware';
import {
  CreateGradeSchema,
  UpdateGradeSchema,
  IdParamSchema,
} from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';

export const gradeRouter = Router();

gradeRouter.use(authenticate);

/**
 * @swagger
 * /api/v1/grades/student/{id}:
 *   get:
 *     summary: Get grades by student ID
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student grades retrieved successfully
 *       404:
 *         description: Student not found
 */
gradeRouter.get(
  '/student/:id',
  checkPermission(Permission.VIEW_GRADES, Permission.VIEW_OWN_GRADES),
  validateParams(IdParamSchema),
  GradeController.getByStudent
);

/**
 * @swagger
 * /api/v1/grades:
 *   post:
 *     summary: Create new grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - classId
 *               - assignmentName
 *               - score
 *               - maxScore
 *               - gradeDate
 *               - category
 *             properties:
 *               studentId:
 *                 type: string
 *                 format: uuid
 *               classId:
 *                 type: string
 *                 format: uuid
 *               assignmentName:
 *                 type: string
 *               score:
 *                 type: number
 *                 minimum: 0
 *               maxScore:
 *                 type: number
 *                 minimum: 0
 *               gradeDate:
 *                 type: string
 *                 format: date-time
 *               comments:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [HOMEWORK, QUIZ, EXAM, PROJECT, PARTICIPATION]
 *     responses:
 *       201:
 *         description: Grade created successfully
 */
gradeRouter.post(
  '/',
  checkPermission(Permission.CREATE_GRADES),
  validateRequest(CreateGradeSchema),
  GradeController.create
);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   put:
 *     summary: Update grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *               maxScore:
 *                 type: number
 *                 minimum: 0
 *               comments:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [HOMEWORK, QUIZ, EXAM, PROJECT, PARTICIPATION]
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       404:
 *         description: Grade not found
 */
gradeRouter.put(
  '/:id',
  checkPermission(Permission.UPDATE_GRADES),
  validateParams(IdParamSchema),
  validateRequest(UpdateGradeSchema),
  GradeController.update
);

/**
 * @swagger
 * /api/v1/grades/{id}:
 *   delete:
 *     summary: Delete grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade not found
 */
gradeRouter.delete(
  '/:id',
  checkPermission(Permission.DELETE_GRADES),
  validateParams(IdParamSchema),
  GradeController.delete
);
