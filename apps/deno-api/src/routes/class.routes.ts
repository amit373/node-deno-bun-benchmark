import { Router } from 'oak';
import { ClassController } from '../controllers/class.controller.ts';
import {
  CreateClassSchema,
  UpdateClassSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';
import { authenticate } from '../middleware/auth.middleware.ts';
import { checkPermission } from '../middleware/permission.middleware.ts';

export const classRouter = new Router({ prefix: '/api/v1/classes' });

classRouter.get('/', authenticate, checkPermission(Permission.VIEW_CLASSES), async (ctx) => {
  const params = ctx.request.url.searchParams;
  const query: Record<string, string | undefined> = {};
  
  // Only include params that have values
  const page = params.get('page');
  const limit = params.get('limit');
  const sortBy = params.get('sortBy');
  const sortOrder = params.get('sortOrder');
  
  if (page) query.page = page;
  if (limit) query.limit = limit;
  if (sortBy) query.sortBy = sortBy;
  if (sortOrder) query.sortOrder = sortOrder;
  
  const validated = PaginationSchema.parse(query);
  ctx.response.body = await ClassController.getAll(validated);
});

classRouter.get('/:id', authenticate, checkPermission(Permission.VIEW_CLASSES), async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  ctx.response.body = await ClassController.getById(validated.id);
});

classRouter.post('/', authenticate, checkPermission(Permission.MANAGE_CLASSES), async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validated = CreateClassSchema.parse(body);
  ctx.response.status = 201;
  ctx.response.body = await ClassController.create(validated);
});

classRouter.put('/:id', authenticate, checkPermission(Permission.MANAGE_CLASSES), async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validatedParams = IdParamSchema.parse(ctx.params);
  const validatedBody = UpdateClassSchema.parse(body);
  ctx.response.body = await ClassController.update(validatedParams.id, validatedBody);
});

classRouter.delete('/:id', authenticate, checkPermission(Permission.MANAGE_CLASSES), async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  await ClassController.delete(validated.id);
  ctx.response.status = 204;
});
