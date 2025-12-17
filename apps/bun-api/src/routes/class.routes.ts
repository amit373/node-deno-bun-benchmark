import { Elysia } from 'elysia';
import { ClassController } from '../controllers/class.controller';
import {
  CreateClassSchema,
  UpdateClassSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { requirePermission } from '../middleware/auth.middleware';
import { Permission } from '@student-api/shared-types';

export const classRoutes = new Elysia({ prefix: '/classes' })
  .use(requirePermission(Permission.VIEW_CLASSES))
  .get('/', async ({ query }) => {
    const validated = PaginationSchema.parse(query);
    return ClassController.getAll(validated);
  })
  .get('/:id', async ({ params }) => {
    const validated = IdParamSchema.parse(params);
    return ClassController.getById(validated.id);
  })
  .use(requirePermission(Permission.MANAGE_CLASSES))
  .post('/', async ({ body }) => {
    const validated = CreateClassSchema.parse(body);
    return ClassController.create(validated);
  })
  .put('/:id', async ({ params, body }) => {
    const validatedParams = IdParamSchema.parse(params);
    const validatedBody = UpdateClassSchema.parse(body);
    return ClassController.update(validatedParams.id, validatedBody);
  })
  .delete('/:id', async ({ params }) => {
    const validated = IdParamSchema.parse(params);
    return ClassController.delete(validated.id);
  });
