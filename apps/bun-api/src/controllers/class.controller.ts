import { ClassService } from '../services/class.service';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import type { CreateClassDto, UpdateClassDto } from '@student-api/shared-types';

export class ClassController {
  static async getAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const result = await ClassService.getAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    });
    return ResponseFormatter.success(result);
  }

  static async getById(id: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const classData = await ClassService.getById(id);
    return ResponseFormatter.success(classData);
  }

  static async create(body: CreateClassDto): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const classData = await ClassService.create(body);
    return ResponseFormatter.success(classData, SUCCESS_MESSAGES.CREATED);
  }

  static async update(id: string, body: UpdateClassDto): Promise<ReturnType<typeof ResponseFormatter.success>> {
    const classData = await ClassService.update(id, body);
    return ResponseFormatter.success(classData, SUCCESS_MESSAGES.UPDATED);
  }

  static async delete(id: string): Promise<ReturnType<typeof ResponseFormatter.success>> {
    await ClassService.delete(id);
    return ResponseFormatter.success(null, SUCCESS_MESSAGES.DELETED);
  }
}
