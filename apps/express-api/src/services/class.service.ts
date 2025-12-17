import { PaginationUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import { AppError } from '@student-api/shared-middleware';
import type {
  Class,
  CreateClassDto,
  UpdateClassDto,
  PaginatedResponse,
  PaginationParams,
} from '@student-api/shared-types';
import { ClassModel } from '../models/index.js';

export class ClassService {
  static async getAll(params: PaginationParams): Promise<PaginatedResponse<Class>> {
    const offset = PaginationUtil.getOffset(params.page, params.limit);
    const total = await ClassModel.countDocuments();
    const classes = await ClassModel.find()
      .skip(offset)
      .limit(params.limit)
      .sort({ createdAt: -1 });

    const data = classes.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      code: c.code,
      teacherId: c.teacherId.toString(),
      subject: c.subject,
      grade: c.grade,
      academicYear: c.academicYear,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return PaginationUtil.paginate(data, total, params);
  }

  static async getById(id: string): Promise<Class> {
    const classData = await ClassModel.findById(id);

    if (!classData) {
      throw new AppError(404, ERROR_MESSAGES.CLASS_NOT_FOUND);
    }

    return {
      id: classData._id.toString(),
      name: classData.name,
      code: classData.code,
      teacherId: classData.teacherId.toString(),
      subject: classData.subject,
      grade: classData.grade,
      academicYear: classData.academicYear,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt,
    };
  }

  static async create(data: CreateClassDto): Promise<Class> {
    const classData = await ClassModel.create(data);

    return {
      id: classData._id.toString(),
      name: classData.name,
      code: classData.code,
      teacherId: classData.teacherId.toString(),
      subject: classData.subject,
      grade: classData.grade,
      academicYear: classData.academicYear,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt,
    };
  }

  static async update(id: string, data: UpdateClassDto): Promise<Class> {
    const classData = await ClassModel.findByIdAndUpdate(id, data, { new: true });

    if (!classData) {
      throw new AppError(404, ERROR_MESSAGES.CLASS_NOT_FOUND);
    }

    return {
      id: classData._id.toString(),
      name: classData.name,
      code: classData.code,
      teacherId: classData.teacherId.toString(),
      subject: classData.subject,
      grade: classData.grade,
      academicYear: classData.academicYear,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt,
    };
  }

  static async delete(id: string): Promise<void> {
    const classData = await ClassModel.findByIdAndDelete(id);

    if (!classData) {
      throw new AppError(404, ERROR_MESSAGES.CLASS_NOT_FOUND);
    }
  }
}
