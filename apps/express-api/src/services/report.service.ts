import { GradeCalculator } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import { AppError } from '@student-api/shared-middleware';
import type { GradeReport } from '@student-api/shared-types';
import { GradeModel, StudentModel, ClassModel } from '../models/index.js';
import type { IGrade } from '../models/grade.model.js';

export class ReportService {
  static async getStudentReport(studentId: string): Promise<GradeReport[]> {
    const student = await StudentModel.findById(studentId).populate('userId', 'firstName lastName');

    if (!student) {
      throw new AppError(404, ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

    const grades = await GradeModel.find({ studentId }).sort({ gradeDate: -1 });

    const groupedByClass = grades.reduce(
      (acc, grade) => {
        const classId = grade.classId.toString();
        if (!acc[classId]) {
          acc[classId] = [];
        }
        acc[classId].push(grade);
        return acc;
      },
      {} as Record<string, IGrade[]>
    );

    const reports: GradeReport[] = [];

    for (const [classId, classGrades] of Object.entries(groupedByClass)) {
      const classData = await ClassModel.findById(classId);

      if (!classData) continue;

      const totalScore = classGrades.reduce((sum, g) => sum + g.score, 0);
      const totalMaxScore = classGrades.reduce((sum, g) => sum + g.maxScore, 0);
      const averagePercentage = GradeCalculator.calculatePercentage(totalScore, totalMaxScore);

      reports.push({
        studentId,
        studentName: `${(student.userId as unknown as { firstName: string; lastName: string }).firstName} ${(student.userId as unknown as { firstName: string; lastName: string }).lastName}`,
        classId,
        className: classData.name,
        grades: classGrades.map((g) => ({
          id: g._id.toString(),
          studentId: g.studentId.toString(),
          classId: g.classId.toString(),
          teacherId: g.teacherId.toString(),
          assignmentName: g.assignmentName,
          category: g.category,
          score: g.score,
          maxScore: g.maxScore,
          percentage: g.percentage,
          letterGrade: g.letterGrade,
          gradeDate: g.gradeDate,
          comments: g.comments,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        })),
        averageScore: totalScore / classGrades.length,
        averagePercentage,
        letterGrade: GradeCalculator.calculateLetterGrade(averagePercentage),
      });
    }

    return reports;
  }

  static async getPerformanceReport(studentId: string): Promise<{
    studentId: string;
    overallGPA: number;
    totalClasses: number;
    reports: GradeReport[];
  }> {
    const reports = await this.getStudentReport(studentId);

    const totalGPA = reports.reduce((sum, report) => {
      const gpa = GradeCalculator.calculateGPA(report.letterGrade);
      return sum + gpa;
    }, 0);

    const overallGPA = reports.length > 0 ? totalGPA / reports.length : 0;

    return {
      studentId,
      overallGPA: Math.round(overallGPA * 100) / 100,
      totalClasses: reports.length,
      reports,
    };
  }
}
