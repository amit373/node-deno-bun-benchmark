import { Router } from 'express';
import { ClassController } from '../controllers/class.controller.js';
import {
  authenticate,
  validateRequest,
  validateParams,
  validateQuery,
  checkPermission,
} from '@student-api/shared-middleware';
import {
  CreateClassSchema,
  UpdateClassSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';

export const classRouter = Router();

classRouter.use(authenticate);

/**
 * @swagger
 * /api/v1/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of classes retrieved successfully
 */
classRouter.get(
  '/',
  checkPermission(Permission.VIEW_CLASSES),
  validateQuery(PaginationSchema),
  ClassController.getAll
);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
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
 *       200:
 *         description: Class retrieved successfully
 *       404:
 *         description: Class not found
 */
classRouter.get(
  '/:id',
  checkPermission(Permission.VIEW_CLASSES),
  validateParams(IdParamSchema),
  ClassController.getById
);

/**
 * @swagger
 * /api/v1/classes:
 *   post:
 *     summary: Create new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - teacherId
 *               - subject
 *               - grade
 *               - academicYear
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               teacherId:
 *                 type: string
 *                 format: uuid
 *               subject:
 *                 type: string
 *               grade:
 *                 type: string
 *               section:
 *                 type: string
 *               schedule:
 *                 type: string
 *               maxStudents:
 *                 type: integer
 *               academicYear:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 */
classRouter.post(
  '/',
  checkPermission(Permission.MANAGE_CLASSES),
  validateRequest(CreateClassSchema),
  ClassController.create
);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   put:
 *     summary: Update class
 *     tags: [Classes]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               teacherId:
 *                 type: string
 *                 format: uuid
 *               schedule:
 *                 type: string
 *               maxStudents:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       404:
 *         description: Class not found
 */
classRouter.put(
  '/:id',
  checkPermission(Permission.MANAGE_CLASSES),
  validateParams(IdParamSchema),
  validateRequest(UpdateClassSchema),
  ClassController.update
);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   delete:
 *     summary: Delete class
 *     tags: [Classes]
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
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
classRouter.delete(
  '/:id',
  checkPermission(Permission.MANAGE_CLASSES),
  validateParams(IdParamSchema),
  ClassController.delete
);
