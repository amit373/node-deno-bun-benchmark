import { Collections } from '../models/collections.ts';
import { ObjectId } from 'mongodb';

export class StudentService {
  static async getAll(params: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const offset = (params.page - 1) * params.limit;
    const total = await Collections.students().countDocuments();

    const students = await Collections.students()
      .find()
      .skip(offset)
      .limit(params.limit)
      .sort({ createdAt: -1 })
      .toArray();

    const data = await Promise.all(
      students.map(async (s) => {
        const user = await Collections.users().findOne({ _id: s.userId });
        return {
          id: s._id!.toString(),
          userId: s.userId.toString(),
          studentId: s.studentId,
          dateOfBirth: s.dateOfBirth,
          enrollmentDate: s.enrollmentDate,
          grade: s.grade,
          section: s.section,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          user: user
            ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }
            : null,
        };
      })
    );

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
    const student = await Collections.students().findOne({ _id: new ObjectId(id) });
    if (!student) throw new Error('Student not found');

    const user = await Collections.users().findOne({ _id: student.userId });

    return {
      id: student._id!.toString(),
      userId: student.userId.toString(),
      studentId: student.studentId,
      dateOfBirth: student.dateOfBirth,
      enrollmentDate: student.enrollmentDate,
      grade: student.grade,
      section: student.section,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        : null,
    };
  }

  static async create(data: any) {
    const newStudent = {
      ...data,
      userId: new ObjectId(data.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.students().insertOne(newStudent);
    const user = await Collections.users().findOne({ _id: newStudent.userId });

    return {
      id: result.insertedId.toString(),
      ...newStudent,
      userId: newStudent.userId.toString(),
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        : null,
    };
  }

  static async update(id: string, data: any) {
    const updateData = { ...data, updatedAt: new Date() };
    if (data.userId) {
      updateData.userId = new ObjectId(data.userId);
    }

    const result = await Collections.students().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error('Student not found');

    const user = await Collections.users().findOne({ _id: result.userId });

    return {
      id: result._id!.toString(),
      userId: result.userId.toString(),
      studentId: result.studentId,
      dateOfBirth: result.dateOfBirth,
      enrollmentDate: result.enrollmentDate,
      grade: result.grade,
      section: result.section,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        : null,
    };
  }

  static async delete(id: string) {
    const result = await Collections.students().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error('Student not found');
  }
}
