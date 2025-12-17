import { GradeService } from './grade.service.ts';
import { StudentService } from './student.service.ts';
import { ClassService } from './class.service.ts';

function calculateLetterGrade(percentage: number): string {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 60) return 'D';
  return 'F';
}

function calculateGPA(letterGrade: string): number {
  const gpaMap: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    D: 1.0,
    F: 0.0,
  };
  return gpaMap[letterGrade] || 0.0;
}

export class ReportService {
  static async getStudentReport(studentId: string) {
    const student = await StudentService.getById(studentId);
    const grades = await GradeService.getByStudentId(studentId);
    const groupedByClass = grades.reduce((acc: any, grade: any) => {
      if (!acc[grade.classId]) acc[grade.classId] = [];
      acc[grade.classId].push(grade);
      return acc;
    }, {});

    const reports = [];
    for (const [classId, classGrades] of Object.entries(groupedByClass) as any) {
      const classData = await ClassService.getById(classId);
      const totalScore = classGrades.reduce((sum: number, g: any) => sum + g.score, 0);
      const totalMaxScore = classGrades.reduce((sum: number, g: any) => sum + g.maxScore, 0);
      const averagePercentage =
        totalMaxScore === 0 ? 0 : Math.round((totalScore / totalMaxScore) * 100 * 100) / 100;
      reports.push({
        studentId,
        studentName: `${student.user.firstName} ${student.user.lastName}`,
        classId,
        className: classData.name,
        grades: classGrades,
        averageScore: totalScore / classGrades.length,
        averagePercentage,
        letterGrade: calculateLetterGrade(averagePercentage),
      });
    }
    return reports;
  }

  static async getPerformanceReport(studentId: string) {
    const reports = await this.getStudentReport(studentId);
    const totalGPA = reports.reduce(
      (sum: number, report: any) => sum + calculateGPA(report.letterGrade),
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
