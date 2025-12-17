import { HTTP_STATUS } from '@student-api/shared-constants';
import { Router } from 'oak';
import { ReportController } from '../controllers/report.controller.ts';
import { IdParamSchema } from '@student-api/shared-zod-schemas';

export const reportRouter = new Router({ prefix: '/api/v1/reports' });

reportRouter.get('/student/:id', async (ctx) => {
  const validated = IdParamSchema.parse(ctx.params);
  ctx.response.body = await ReportController.getStudentReport(validated.id);
});
