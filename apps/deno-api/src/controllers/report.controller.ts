import { ReportService } from '../services/report.service.ts';
import { ResponseFormatter } from '@student-api/shared-utils';

export class ReportController {
  static async getStudentReport(studentId: string) {
    const report = await ReportService.getPerformanceReport(studentId);
    return ResponseFormatter.success(report);
  }
}
