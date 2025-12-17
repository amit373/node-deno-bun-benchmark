import { PaginationUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import type {
  Class,
  CreateClassDto,
  UpdateClassDto,
  PaginatedResponse,
  PaginationParams,
} from '@student-api/shared-types';
import { Collections } from '../models/collections';
import { ObjectId } from 'mongodb';

export class ClassService {
  static async getAll(params: PaginationParams): Promise<PaginatedResponse<Class>> {
    const offset = PaginationUtil.getOffset(params.page, params.limit);
    const total = await Collections.classes().countDocuments();

    const classes = await Collections.classes()
      .find()
      .skip(offset)
      .limit(params.limit)
      .sort({ createdAt: -1 })
      .toArray();

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
    const classData = await Collections.classes().findOne({ _id: new ObjectId(id) });
    if (!classData) throw new Error(ERROR_MESSAGES.CLASS_NOT_FOUND);

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
    const newClass = {
      name: data.name,
      code: data.code,
      teacherId: new ObjectId(data.teacherId),
      subject: data.subject,
      grade: data.grade,
      academicYear: data.academicYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.classes().insertOne(newClass);

    return {
      id: result.insertedId.toString(),
      name: newClass.name,
      code: newClass.code,
      teacherId: newClass.teacherId.toString(),
      subject: newClass.subject,
      grade: newClass.grade,
      academicYear: newClass.academicYear,
      createdAt: newClass.createdAt,
      updatedAt: newClass.updatedAt,
    };
  }

  static async update(id: string, data: UpdateClassDto): Promise<Class> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.maxStudents !== undefined) updateData.maxStudents = data.maxStudents;
    if (data.teacherId !== undefined) updateData.teacherId = new ObjectId(data.teacherId);

    const result = await Collections.classes().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error(ERROR_MESSAGES.CLASS_NOT_FOUND);

    return {
      id: result._id.toString(),
      name: result.name,
      code: result.code,
      teacherId: result.teacherId.toString(),
      subject: result.subject,
      grade: result.grade,
      academicYear: result.academicYear,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static async delete(id: string): Promise<void> {
    const result = await Collections.classes().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error(ERROR_MESSAGES.CLASS_NOT_FOUND);
  }
}
