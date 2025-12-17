import { GradeService } from '../services/grade.service.ts';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import { CreateGradeDto, UpdateGradeDto } from '@student-api/shared-types';

export class GradeController {
  static async getByStudentId(studentId: string) {
    const grades = await GradeService.getByStudentId(studentId);
    return ResponseFormatter.success(grades);
  }

  static async create(body: CreateGradeDto & { teacherId: string }) {
    const grade = await GradeService.create(body);
    return ResponseFormatter.success(grade, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateGradeDto) {
    const grade = await GradeService.update(id, body);
    return ResponseFormatter.success(grade, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string) {
    await GradeService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
