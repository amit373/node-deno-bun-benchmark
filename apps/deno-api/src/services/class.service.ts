import { Collections } from '../models/collections.ts';
import { ObjectId } from 'mongodb';

export class ClassService {
  static async getAll(params: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const offset = (params.page - 1) * params.limit;
    const total = await Collections.classes().countDocuments();

    const classes = await Collections.classes()
      .find()
      .skip(offset)
      .limit(params.limit)
      .sort({ createdAt: -1 })
      .toArray();

    const data = classes.map((c) => ({
      id: c._id!.toString(),
      name: c.name,
      code: c.code,
      teacherId: c.teacherId.toString(),
      subject: c.subject,
      grade: c.grade,
      academicYear: c.academicYear,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  static async getById(id: string) {
    const classData = await Collections.classes().findOne({ _id: new ObjectId(id) });
    if (!classData) throw new Error('Class not found');

    return {
      id: classData._id!.toString(),
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

  static async create(data: any) {
    const newClass = {
      ...data,
      teacherId: new ObjectId(data.teacherId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.classes().insertOne(newClass);

    return {
      id: result.insertedId.toString(),
      ...newClass,
      teacherId: newClass.teacherId.toString(),
    };
  }

  static async update(id: string, data: any) {
    const updateData = { ...data, updatedAt: new Date() };
    if (data.teacherId) {
      updateData.teacherId = new ObjectId(data.teacherId);
    }

    const result = await Collections.classes().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error('Class not found');

    return {
      id: result._id!.toString(),
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

  static async delete(id: string) {
    const result = await Collections.classes().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error('Class not found');
  }
}
