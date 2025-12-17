import { Elysia } from 'elysia';
import { ReportController } from '../controllers/report.controller';
import { IdParamSchema } from '@student-api/shared-zod-schemas';

export const reportRoutes = new Elysia({ prefix: '/reports' }).get(
  '/student/:id',
  async ({ params }) => {
    const validated = IdParamSchema.parse(params);
    return ReportController.getStudentReport(validated.id);
  }
);
