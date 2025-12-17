import { StudentService } from '../services/student.service.ts';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import { CreateStudentDto, UpdateStudentDto } from '@student-api/shared-types';

export class StudentController {
  static async getAll(query: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const result = await StudentService.getAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc',
    });
    return ResponseFormatter.success(result);
  }

  static async getById(id: string) {
    const student = await StudentService.getById(id);
    return ResponseFormatter.success(student);
  }

  static async create(body: CreateStudentDto) {
    const student = await StudentService.create(body);
    return ResponseFormatter.success(student, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateStudentDto) {
    const student = await StudentService.update(id, body);
    return ResponseFormatter.success(student, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string) {
    await StudentService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
