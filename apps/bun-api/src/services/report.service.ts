import { GradeCalculator } from '@student-api/shared-utils';
import type { GradeReport } from '@student-api/shared-types';
import { GradeService } from './grade.service';
import { StudentService } from './student.service';
import { ClassService } from './class.service';

export class ReportService {
  static async getStudentReport(studentId: string): Promise<GradeReport[]> {
    const student = await StudentService.getById(studentId);
    const grades = await GradeService.getByStudentId(studentId);
    const groupedByClass = grades.reduce(
      (acc, grade) => {
        if (!acc[grade.classId]) acc[grade.classId] = [];
        acc[grade.classId].push(grade);
        return acc;
      },
      {} as Record<string, typeof grades>
    );

    const reports: GradeReport[] = [];
    for (const [classId, classGrades] of Object.entries(groupedByClass)) {
      const classData = await ClassService.getById(classId);
      const totalScore = classGrades.reduce((sum, g) => sum + g.score, 0);
      const totalMaxScore = classGrades.reduce((sum, g) => sum + g.maxScore, 0);
      const averagePercentage = GradeCalculator.calculatePercentage(totalScore, totalMaxScore);
      reports.push({
        studentId,
        studentName: `${student.user.firstName} ${student.user.lastName}`,
        classId,
        className: classData.name,
        grades: classGrades,
        averageScore: totalScore / classGrades.length,
        averagePercentage,
        letterGrade: GradeCalculator.calculateLetterGrade(averagePercentage),
      });
    }
    return reports;
  }

  static async getPerformanceReport(studentId: string): Promise<{ studentId: string; overallGPA: number; totalClasses: number; reports: GradeReport[] }> {
    const reports = await this.getStudentReport(studentId);
    const totalGPA = reports.reduce(
      (sum, report) => sum + GradeCalculator.calculateGPA(report.letterGrade),
      0
    );
    return {
      studentId,
      overallGPA: Math.round((totalGPA / reports.length) * 100) / 100,
      totalClasses: reports.length,
      reports,
    };
  }
}
