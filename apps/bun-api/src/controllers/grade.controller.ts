import { GradeService } from '../services/grade.service';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import type { CreateGradeDto, UpdateGradeDto } from '@student-api/shared-types';

export class GradeController {
  static async getByStudentId(studentId: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const grades = await GradeService.getByStudentId(studentId);
    return ResponseFormatter.success(grades);
  }

  static async create(body: CreateGradeDto & { teacherId: string }): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const grade = await GradeService.create(body);
    return ResponseFormatter.success(grade, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateGradeDto): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const grade = await GradeService.update(id, body);
    return ResponseFormatter.success(grade, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    await GradeService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
