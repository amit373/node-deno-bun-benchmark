import { GradeCalculator } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import type { Grade, CreateGradeDto, UpdateGradeDto } from '@student-api/shared-types';
import { Collections } from '../models/collections';
import { ObjectId } from 'mongodb';

export class GradeService {
  static async getByStudentId(studentId: string): Promise<Grade[]> {
    const grades = await Collections.grades()
      .find({ studentId: new ObjectId(studentId) })
      .sort({ gradeDate: -1 })
      .toArray();

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

    const newGrade = {
      studentId: new ObjectId(data.studentId),
      classId: new ObjectId(data.classId),
      teacherId: new ObjectId(data.teacherId),
      assignmentName: data.assignmentName,
      category: data.category,
      score: data.score,
      maxScore: data.maxScore,
      percentage,
      letterGrade,
      gradeDate: new Date(data.gradeDate),
      comments: data.comments,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.grades().insertOne(newGrade);

    return {
      id: result.insertedId.toString(),
      studentId: newGrade.studentId.toString(),
      classId: newGrade.classId.toString(),
      teacherId: newGrade.teacherId.toString(),
      assignmentName: newGrade.assignmentName,
      category: newGrade.category,
      score: newGrade.score,
      maxScore: newGrade.maxScore,
      percentage: newGrade.percentage,
      letterGrade: newGrade.letterGrade,
      gradeDate: newGrade.gradeDate,
      comments: newGrade.comments,
      createdAt: newGrade.createdAt,
      updatedAt: newGrade.updatedAt,
    };
  }

  static async update(id: string, data: UpdateGradeDto): Promise<Grade> {
    const existing = await Collections.grades().findOne({ _id: new ObjectId(id) });
    if (!existing) throw new Error(ERROR_MESSAGES.GRADE_NOT_FOUND);

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.score !== undefined) updateData.score = data.score;
    if (data.maxScore !== undefined) updateData.maxScore = data.maxScore;
    if (data.comments !== undefined) updateData.comments = data.comments;
    if (data.category !== undefined) updateData.category = data.category;

    if (data.score !== undefined || data.maxScore !== undefined) {
      const score = data.score ?? existing.score;
      const maxScore = data.maxScore ?? existing.maxScore;
      updateData.percentage = GradeCalculator.calculatePercentage(score, maxScore);
      updateData.letterGrade = GradeCalculator.calculateLetterGrade(
        updateData.percentage as number
      );
    }

    const result = await Collections.grades().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error(ERROR_MESSAGES.GRADE_NOT_FOUND);

    return {
      id: result._id.toString(),
      studentId: result.studentId.toString(),
      classId: result.classId.toString(),
      teacherId: result.teacherId.toString(),
      assignmentName: result.assignmentName,
      category: result.category,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      letterGrade: result.letterGrade,
      gradeDate: result.gradeDate,
      comments: result.comments,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static async delete(id: string): Promise<void> {
    const result = await Collections.grades().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error(ERROR_MESSAGES.GRADE_NOT_FOUND);
  }
}
