import { ReportService } from '../services/report.service';
import { ResponseFormatter } from '@student-api/shared-utils';

export class ReportController {
  static async getStudentReport(studentId: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const report = await ReportService.getPerformanceReport(studentId);
    return ResponseFormatter.success(report);
  }
}
