import { Elysia, t } from 'elysia';
import { StudentController } from '../controllers/student.controller';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { requireAuth, requirePermission } from '../middleware/auth.middleware';
import { Permission } from '@student-api/shared-types';

export const studentRoutes = new Elysia({ prefix: '/students', tags: ['Students'] })
  .use(requireAuth)
  .use(requirePermission(Permission.VIEW_STUDENTS))
  .get(
    '/',
    async ({ query }) => {
      const validated = PaginationSchema.parse(query);
      return StudentController.getAll(validated);
    },
    {
      detail: {
        summary: 'Get all students',
        description: 'Retrieve paginated list of students',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
      },
      query: t.Object({
        page: t.Optional(t.Number({ default: 1 })),
        limit: t.Optional(t.Number({ default: 10, maximum: 100 })),
        sortBy: t.Optional(t.String()),
        sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')])),
      }),
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const validated = IdParamSchema.parse(params);
      return StudentController.getById(validated.id);
    },
    {
      detail: {
        summary: 'Get student by ID',
        description: 'Retrieve a single student by UUID',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
    }
  )
  .post(
    '/',
    async ({ body }) => {
      const validated = CreateStudentSchema.parse(body);
      return StudentController.create(validated);
    },
    {
      detail: {
        summary: 'Create new student',
        description: 'Create a new student record',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
      },
      body: t.Object({
        userId: t.String({ format: 'uuid' }),
        studentId: t.String(),
        dateOfBirth: t.String({ format: 'date-time' }),
        enrollmentDate: t.String({ format: 'date-time' }),
        grade: t.String(),
        section: t.Optional(t.String()),
        parentId: t.Optional(t.String({ format: 'uuid' })),
        address: t.Optional(t.String()),
        phoneNumber: t.Optional(t.String()),
        emergencyContact: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const validatedParams = IdParamSchema.parse(params);
      const validatedBody = UpdateStudentSchema.parse(body);
      return StudentController.update(validatedParams.id, validatedBody);
    },
    {
      detail: {
        summary: 'Update student',
        description: 'Update student information',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
      body: t.Object({
        grade: t.Optional(t.String()),
        section: t.Optional(t.String()),
        address: t.Optional(t.String()),
        phoneNumber: t.Optional(t.String()),
        emergencyContact: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    '/:id',
    async ({ params }) => {
      const validated = IdParamSchema.parse(params);
      return StudentController.delete(validated.id);
    },
    {
      detail: {
        summary: 'Delete student',
        description: 'Delete a student record',
        tags: ['Students'],
        security: [{ bearerAuth: [] }],
      },
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
    }
  );
