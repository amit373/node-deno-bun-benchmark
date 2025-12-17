import { Router } from 'oak';
import { GradeController } from '../controllers/grade.controller.ts';
import {
  CreateGradeSchema,
  UpdateGradeSchema,
  IdParamSchema,
} from '@student-api/shared-zod-schemas';
import { HTTP_STATUS } from '@student-api/shared-constants';

export const gradeRouter = new Router({ prefix: '/api/v1/grades' });

gradeRouter.get('/student/:id', async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  ctx.response.body = await GradeController.getByStudentId(validated.id);
});

gradeRouter.post('/', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validated = CreateGradeSchema.parse(body);
  const teacherId = ctx.state.user?.userId || '';
  const result = await GradeController.create({ ...validated, teacherId });
  ctx.response.status = HTTP_STATUS.CREATED;
  ctx.response.body = result;
});

gradeRouter.put('/:id', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validatedParams = IdParamSchema.parse(ctx.params);
  const validatedBody = UpdateGradeSchema.parse(body);
  ctx.response.body = await GradeController.update(validatedParams.id, validatedBody);
});

gradeRouter.delete('/:id', async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  const result = await GradeController.delete(validated.id);
  ctx.response.body = result;
});
