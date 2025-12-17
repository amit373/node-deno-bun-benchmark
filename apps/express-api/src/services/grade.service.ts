import { GradeCalculator } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import { AppError } from '@student-api/shared-middleware';
import type { Grade, CreateGradeDto, UpdateGradeDto } from '@student-api/shared-types';
import { GradeModel } from '../models/index.js';

export class GradeService {
  static async getByStudentId(studentId: string): Promise<Grade[]> {
    const grades = await GradeModel.find({ studentId }).sort({ gradeDate: -1 });

    return grades.map((g) => ({
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
    }));
  }

  static async create(data: CreateGradeDto & { teacherId: string }): Promise<Grade> {
    const percentage = GradeCalculator.calculatePercentage(data.score, data.maxScore);
    const letterGrade = GradeCalculator.calculateLetterGrade(percentage);

    const grade = await GradeModel.create({
      ...data,
      percentage,
      letterGrade,
    });

    return {
      id: grade._id.toString(),
      studentId: grade.studentId.toString(),
      classId: grade.classId.toString(),
      teacherId: grade.teacherId.toString(),
      assignmentName: grade.assignmentName,
      category: grade.category,
      score: grade.score,
      maxScore: grade.maxScore,
      percentage: grade.percentage,
      letterGrade: grade.letterGrade,
      gradeDate: grade.gradeDate,
      comments: grade.comments,
      createdAt: grade.createdAt,
      updatedAt: grade.updatedAt,
    };
  }

  static async update(id: string, data: UpdateGradeDto): Promise<Grade> {
    const existingGrade = await GradeModel.findById(id);

    if (!existingGrade) {
      throw new AppError(404, ERROR_MESSAGES.GRADE_NOT_FOUND);
    }

    const updateData: Record<string, unknown> = {};

    if (data.score !== undefined) updateData.score = data.score;
    if (data.maxScore !== undefined) updateData.maxScore = data.maxScore;
    if (data.comments !== undefined) updateData.comments = data.comments;
    if (data.category !== undefined) updateData.category = data.category;

    if (data.score !== undefined || data.maxScore !== undefined) {
      const score = data.score ?? existingGrade.score;
      const maxScore = data.maxScore ?? existingGrade.maxScore;
      updateData.percentage = GradeCalculator.calculatePercentage(score, maxScore);
      updateData.letterGrade = GradeCalculator.calculateLetterGrade(
        updateData.percentage as number
      );
    }

    const grade = await GradeModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!grade) {
      throw new AppError(404, ERROR_MESSAGES.GRADE_NOT_FOUND);
    }

    return {
      id: grade._id.toString(),
      studentId: grade.studentId.toString(),
      classId: grade.classId.toString(),
      teacherId: grade.teacherId.toString(),
      assignmentName: grade.assignmentName,
      category: grade.category,
      score: grade.score,
      maxScore: grade.maxScore,
      percentage: grade.percentage,
      letterGrade: grade.letterGrade,
      gradeDate: grade.gradeDate,
      comments: grade.comments,
      createdAt: grade.createdAt,
      updatedAt: grade.updatedAt,
    };
  }

  static async delete(id: string): Promise<void> {
    const grade = await GradeModel.findByIdAndDelete(id);

    if (!grade) {
      throw new AppError(404, ERROR_MESSAGES.GRADE_NOT_FOUND);
    }
  }
}
