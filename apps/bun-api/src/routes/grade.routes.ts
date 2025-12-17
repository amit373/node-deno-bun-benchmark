import { Elysia } from 'elysia';
import { GradeController } from '../controllers/grade.controller';
import {
  CreateGradeSchema,
  UpdateGradeSchema,
  IdParamSchema,
} from '@student-api/shared-zod-schemas';

export const gradeRoutes = new Elysia({ prefix: '/grades' })
  .get('/student/:id', async ({ params }) => {
    const validated = IdParamSchema.parse(params);
    return GradeController.getByStudentId(validated.id);
  })
  .post('/', async ({ body }) => {
    const validated = CreateGradeSchema.parse(body);
    const teacherId = 'temp-teacher-id';
    return GradeController.create({ ...validated, teacherId });
  })
  .put('/:id', async ({ params, body }) => {
    const validatedParams = IdParamSchema.parse(params);
    const validatedBody = UpdateGradeSchema.parse(body);
    return GradeController.update(validatedParams.id, validatedBody);
  })
  .delete('/:id', async ({ params }) => {
    const validated = IdParamSchema.parse(params);
    return GradeController.delete(validated.id);
  });
