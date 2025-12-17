import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate, validateParams, checkPermission } from '@student-api/shared-middleware';
import { IdParamSchema } from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';

export const reportRouter = Router();

reportRouter.use(authenticate);

/**
 * @swagger
 * /api/v1/reports/students/{id}:
 *   get:
 *     summary: Get comprehensive student report
 *     tags: [Reports]
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
 *         description: Student report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   type: object
 *                 grades:
 *                   type: array
 *                 classes:
 *                   type: array
 *       404:
 *         description: Student not found
 */
reportRouter.get(
  '/students/:id',
  checkPermission(Permission.VIEW_REPORTS),
  validateParams(IdParamSchema),
  ReportController.getStudentReport
);

/**
 * @swagger
 * /api/v1/reports/performance/{id}:
 *   get:
 *     summary: Get student performance analytics report
 *     tags: [Reports]
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
 *         description: Performance report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageScore:
 *                   type: number
 *                 totalGrades:
 *                   type: integer
 *                 gradesByCategory:
 *                   type: object
 *                 trend:
 *                   type: string
 *       404:
 *         description: Student not found
 */
reportRouter.get(
  '/performance/:id',
  checkPermission(Permission.VIEW_REPORTS),
  validateParams(IdParamSchema),
  ReportController.getPerformanceReport
);
