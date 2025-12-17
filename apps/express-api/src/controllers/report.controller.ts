import type { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service.js';
import { ResponseFormatter } from '@student-api/shared-utils';
import { asyncWrapper } from '@student-api/shared-middleware';

export class ReportController {
  static getStudentReport = asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const report = await ReportService.getStudentReport(id);
      res.json(ResponseFormatter.success(report));
    }
  );

  static getPerformanceReport = asyncWrapper(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const report = await ReportService.getPerformanceReport(id);
      res.json(ResponseFormatter.success(report));
    }
  );
}
