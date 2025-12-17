import { GRADE_SCALE } from '@student-api/shared-constants';

export class GradeCalculator {
  static calculatePercentage(score: number, maxScore: number): number {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100 * 100) / 100;
  }

  static calculateLetterGrade(percentage: number): string {
    for (const [, scale] of Object.entries(GRADE_SCALE)) {
      if (percentage >= scale.min && percentage <= scale.max) {
        return scale.letter;
      }
    }
    return 'F';
  }

  static calculateGPA(letterGrade: string): number {
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
}
