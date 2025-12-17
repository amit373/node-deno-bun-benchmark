import { Collections } from '../models/collections.ts';
import { ObjectId } from 'mongodb';

function calculatePercentage(score: number, maxScore: number): number {
  return maxScore === 0 ? 0 : Math.round((score / maxScore) * 100 * 100) / 100;
}

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

export class GradeService {
  static async getByStudentId(studentId: string) {
    const grades = await Collections.grades()
      .find({ studentId: new ObjectId(studentId) })
      .sort({ gradeDate: -1 })
      .toArray();

    return grades.map((g) => ({
      id: g._id!.toString(),
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

  static async create(data: any) {
    const percentage = calculatePercentage(data.score, data.maxScore);
    const letterGrade = calculateLetterGrade(percentage);

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
      gradeDate: data.gradeDate || new Date(),
      comments: data.comments,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.grades().insertOne(newGrade);

    return {
      id: result.insertedId.toString(),
      ...newGrade,
      studentId: newGrade.studentId.toString(),
      classId: newGrade.classId.toString(),
      teacherId: newGrade.teacherId.toString(),
    };
  }

  static async update(id: string, data: any) {
    const existing = await Collections.grades().findOne({ _id: new ObjectId(id) });
    if (!existing) throw new Error('Grade not found');

    const updateData: any = { ...data, updatedAt: new Date() };

    if (data.score !== undefined || data.maxScore !== undefined) {
      const score = data.score ?? existing.score;
      const maxScore = data.maxScore ?? existing.maxScore;
      updateData.percentage = calculatePercentage(score, maxScore);
      updateData.letterGrade = calculateLetterGrade(updateData.percentage);
    }

    if (data.studentId) updateData.studentId = new ObjectId(data.studentId);
    if (data.classId) updateData.classId = new ObjectId(data.classId);
    if (data.teacherId) updateData.teacherId = new ObjectId(data.teacherId);

    const result = await Collections.grades().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error('Grade not found');

    return {
      id: result._id!.toString(),
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

  static async delete(id: string) {
    const result = await Collections.grades().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error('Grade not found');
  }
}
