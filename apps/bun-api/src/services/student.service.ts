import { PaginationUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import type {
  StudentWithUser,
  CreateStudentDto,
  UpdateStudentDto,
  PaginatedResponse,
  PaginationParams,
} from '@student-api/shared-types';
import { Collections } from '../models/collections';
import { ObjectId } from 'mongodb';

export class StudentService {
  static async getAll(params: PaginationParams): Promise<PaginatedResponse<StudentWithUser>> {
    const offset = PaginationUtil.getOffset(params.page, params.limit);
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
          id: s._id.toString(),
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
            : { firstName: '', lastName: '', email: '' },
        };
      })
    );

    return PaginationUtil.paginate(data, total, params);
  }

  static async getById(id: string): Promise<StudentWithUser> {
    const student = await Collections.students().findOne({ _id: new ObjectId(id) });
    if (!student) throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);

    const user = await Collections.users().findOne({ _id: student.userId });

    return {
      id: student._id.toString(),
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
        : { firstName: '', lastName: '', email: '' },
    };
  }

  static async create(data: CreateStudentDto): Promise<StudentWithUser> {
    const newStudent = {
      userId: new ObjectId(data.userId),
      studentId: data.studentId,
      dateOfBirth: new Date(data.dateOfBirth),
      enrollmentDate: new Date(data.enrollmentDate),
      grade: data.grade,
      section: data.section ?? 'A',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await Collections.students().insertOne(newStudent);
    const user = await Collections.users().findOne({ _id: newStudent.userId });

    return {
      id: result.insertedId.toString(),
      userId: newStudent.userId.toString(),
      studentId: newStudent.studentId,
      dateOfBirth: newStudent.dateOfBirth,
      enrollmentDate: newStudent.enrollmentDate,
      grade: newStudent.grade,
      section: newStudent.section,
      createdAt: newStudent.createdAt,
      updatedAt: newStudent.updatedAt,
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
        : { firstName: '', lastName: '', email: '' },
    };
  }

  static async update(id: string, data: UpdateStudentDto): Promise<StudentWithUser> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.grade !== undefined) updateData.grade = data.grade;
    if (data.section !== undefined) updateData.section = data.section;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact;

    const result = await Collections.students().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);

    const user = await Collections.users().findOne({ _id: result.userId });

    return {
      id: result._id.toString(),
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
        : { firstName: '', lastName: '', email: '' },
    };
  }

  static async delete(id: string): Promise<void> {
    const result = await Collections.students().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) throw new Error(ERROR_MESSAGES.STUDENT_NOT_FOUND);
  }
}
