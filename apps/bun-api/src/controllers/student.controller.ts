import { StudentService } from '../services/student.service';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import type { CreateStudentDto, UpdateStudentDto } from '@student-api/shared-types';

export class StudentController {
  static async getAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const result = await StudentService.getAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    });
    return ResponseFormatter.success(result);
  }

  static async getById(id: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const student = await StudentService.getById(id);
    return ResponseFormatter.success(student);
  }

  static async create(body: CreateStudentDto): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const student = await StudentService.create(body);
    return ResponseFormatter.success(student, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateStudentDto): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const student = await StudentService.update(id, body);
    return ResponseFormatter.success(student, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    await StudentService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
