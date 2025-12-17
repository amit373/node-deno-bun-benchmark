import { ClassService } from '../services/class.service.ts';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import { CreateClassDto, UpdateClassDto } from '@student-api/shared-types';

export class ClassController {
  static async getAll(query: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const result = await ClassService.getAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc',
    });
    return ResponseFormatter.success(result);
  }

  static async getById(id: string) {
    const classData = await ClassService.getById(id);
    return ResponseFormatter.success(classData);
  }

  static async create(body: CreateClassDto) {
    const classData = await ClassService.create(body);
    return ResponseFormatter.success(classData, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateClassDto) {
    const classData = await ClassService.update(id, body);
    return ResponseFormatter.success(classData, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string) {
    await ClassService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
