import { PaginationUtil } from '@student-api/shared-utils';
import { ERROR_MESSAGES } from '@student-api/shared-constants';
import { AppError } from '@student-api/shared-middleware';
import type {
  StudentWithUser,
  CreateStudentDto,
  UpdateStudentDto,
  PaginatedResponse,
  PaginationParams,
} from '@student-api/shared-types';
import { StudentModel } from '../models/index.js';

export class StudentService {
  static async getAll(params: PaginationParams): Promise<PaginatedResponse<StudentWithUser>> {
    const offset = PaginationUtil.getOffset(params.page, params.limit);
    const total = await StudentModel.countDocuments();
    const students = await StudentModel.find()
      .populate('userId', 'firstName lastName email')
      .skip(offset)
      .limit(params.limit)
      .sort({ createdAt: -1 });

    const data = students.map((s) => ({
      id: s._id.toString(),
      userId: s.userId.toString(),
      studentId: s.studentId,
      dateOfBirth: s.dateOfBirth,
      enrollmentDate: s.enrollmentDate,
      grade: s.grade,
      section: s.section,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      user: {
        firstName: (s.userId as unknown as { firstName: string }).firstName,
        lastName: (s.userId as unknown as { lastName: string }).lastName,
        email: (s.userId as unknown as { email: string }).email,
      },
    }));

    return PaginationUtil.paginate(data, total, params);
  }

  static async getById(id: string): Promise<StudentWithUser> {
    const student = await StudentModel.findById(id).populate('userId', 'firstName lastName email');

    if (!student) {
      throw new AppError(404, ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

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
      user: {
        firstName: (student.userId as unknown as { firstName: string; lastName: string; email: string }).firstName,
        lastName: (student.userId as unknown as { firstName: string; lastName: string; email: string }).lastName,
        email: (student.userId as unknown as { firstName: string; lastName: string; email: string }).email,
      },
    };
  }

  static async create(data: CreateStudentDto): Promise<StudentWithUser> {
    const student = await StudentModel.create(data);
    const populated = await student.populate('userId', 'firstName lastName email');

    return {
      id: populated._id.toString(),
      userId: populated.userId.toString(),
      studentId: populated.studentId,
      dateOfBirth: populated.dateOfBirth,
      enrollmentDate: populated.enrollmentDate,
      grade: populated.grade,
      section: populated.section,
      createdAt: populated.createdAt,
      updatedAt: populated.updatedAt,
      user: {
        firstName: (populated.userId as unknown as { firstName: string }).firstName,
        lastName: (populated.userId as unknown as { lastName: string }).lastName,
        email: (populated.userId as unknown as { email: string }).email,
      },
    };
  }

  static async update(id: string, data: UpdateStudentDto): Promise<StudentWithUser> {
    const student = await StudentModel.findByIdAndUpdate(id, data, { new: true }).populate(
      'userId',
      'firstName lastName email'
    );

    if (!student) {
      throw new AppError(404, ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }

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
      user: {
        firstName: (student.userId as unknown as { firstName: string; lastName: string; email: string }).firstName,
        lastName: (student.userId as unknown as { firstName: string; lastName: string; email: string }).lastName,
        email: (student.userId as unknown as { firstName: string; lastName: string; email: string }).email,
      },
    };
  }

  static async delete(id: string): Promise<void> {
    const student = await StudentModel.findByIdAndDelete(id);

    if (!student) {
      throw new AppError(404, ERROR_MESSAGES.STUDENT_NOT_FOUND);
    }
  }
}
