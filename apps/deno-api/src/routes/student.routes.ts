import { Router } from 'oak';
import { StudentController } from '../controllers/student.controller.ts';
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  IdParamSchema,
  PaginationSchema,
} from '@student-api/shared-zod-schemas';
import { Permission } from '@student-api/shared-types';
import { authenticate } from '../middleware/auth.middleware.ts';
import { checkPermission } from '../middleware/permission.middleware.ts';
import { HTTP_STATUS } from '@student-api/shared-constants';

export const studentRouter = new Router({ prefix: '/api/v1/students' });

studentRouter.get('/', authenticate, checkPermission(Permission.VIEW_STUDENTS), async (ctx) => {
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
  ctx.response.body = await StudentController.getAll(validated);
});

studentRouter.get('/:id', authenticate, checkPermission(Permission.VIEW_STUDENTS), async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  ctx.response.body = await StudentController.getById(validated.id);
});

studentRouter.post('/', authenticate, checkPermission(Permission.MANAGE_STUDENTS), async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validated = CreateStudentSchema.parse(body);
  const result = await StudentController.create(validated);
  ctx.response.status = result.status || HTTP_STATUS.CREATED;
  ctx.response.body = result;
});

studentRouter.put('/:id', authenticate, checkPermission(Permission.MANAGE_STUDENTS), async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validatedParams = IdParamSchema.parse(ctx.params);
  const validatedBody = UpdateStudentSchema.parse(body);
  ctx.response.body = await StudentController.update(validatedParams.id, validatedBody);
});

studentRouter.delete('/:id', authenticate, checkPermission(Permission.MANAGE_STUDENTS), async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  const result = await StudentController.delete(validated.id);
  ctx.response.status = result.status;
});
