// Reusable schema components
export const commonSchemas = {
  Error: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Error message' },
      statusCode: { type: 'integer', example: 400 },
    },
  },
  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'object' },
    },
  },
  PaginationParams: {
    type: 'object',
    properties: {
      page: { type: 'integer', default: 1, minimum: 1 },
      limit: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
      sortBy: { type: 'string' },
      sortOrder: { type: 'string', enum: ['asc', 'desc'] },
    },
  },
  UUIDParam: {
    type: 'string',
    format: 'uuid',
    description: 'UUID identifier',
  },
};

export const authSchemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'user@example.com' },
      password: { type: 'string', minLength: 8, example: 'Password123' },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      },
    },
  },
  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' },
    },
  },
};

export const studentSchemas = {
  Student: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      studentId: { type: 'string' },
      dateOfBirth: { type: 'string', format: 'date-time' },
      enrollmentDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string' },
      section: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateStudentRequest: {
    type: 'object',
    required: ['userId', 'studentId', 'dateOfBirth', 'enrollmentDate', 'grade'],
    properties: {
      userId: { type: 'string', format: 'uuid' },
      studentId: { type: 'string' },
      dateOfBirth: { type: 'string', format: 'date-time' },
      enrollmentDate: { type: 'string', format: 'date-time' },
      grade: { type: 'string' },
      section: { type: 'string' },
      parentId: { type: 'string', format: 'uuid' },
      address: { type: 'string' },
      phoneNumber: { type: 'string' },
      emergencyContact: { type: 'string' },
    },
  },
  UpdateStudentRequest: {
    type: 'object',
    properties: {
      grade: { type: 'string' },
      section: { type: 'string' },
      address: { type: 'string' },
      phoneNumber: { type: 'string' },
      emergencyContact: { type: 'string' },
    },
  },
};

export const classSchemas = {
  Class: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      code: { type: 'string' },
      description: { type: 'string' },
      teacherId: { type: 'string', format: 'uuid' },
      subject: { type: 'string' },
      grade: { type: 'string' },
      section: { type: 'string' },
      schedule: { type: 'string' },
      maxStudents: { type: 'integer' },
      academicYear: { type: 'string' },
    },
  },
  CreateClassRequest: {
    type: 'object',
    required: ['name', 'code', 'teacherId', 'subject', 'grade', 'academicYear'],
    properties: {
      name: { type: 'string' },
      code: { type: 'string' },
      description: { type: 'string' },
      teacherId: { type: 'string', format: 'uuid' },
      subject: { type: 'string' },
      grade: { type: 'string' },
      section: { type: 'string' },
      schedule: { type: 'string' },
      maxStudents: { type: 'integer' },
      academicYear: { type: 'string' },
    },
  },
};

export const gradeSchemas = {
  Grade: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      studentId: { type: 'string', format: 'uuid' },
      classId: { type: 'string', format: 'uuid' },
      assignmentName: { type: 'string' },
      score: { type: 'number' },
      maxScore: { type: 'number' },
      gradeDate: { type: 'string', format: 'date-time' },
      comments: { type: 'string' },
      category: {
        type: 'string',
        enum: ['HOMEWORK', 'QUIZ', 'EXAM', 'PROJECT', 'PARTICIPATION'],
      },
    },
  },
  CreateGradeRequest: {
    type: 'object',
    required: [
      'studentId',
      'classId',
      'assignmentName',
      'score',
      'maxScore',
      'gradeDate',
      'category',
    ],
    properties: {
      studentId: { type: 'string', format: 'uuid' },
      classId: { type: 'string', format: 'uuid' },
      assignmentName: { type: 'string' },
      score: { type: 'number', minimum: 0 },
      maxScore: { type: 'number', minimum: 0 },
      gradeDate: { type: 'string', format: 'date-time' },
      comments: { type: 'string' },
      category: {
        type: 'string',
        enum: ['HOMEWORK', 'QUIZ', 'EXAM', 'PROJECT', 'PARTICIPATION'],
      },
    },
  },
};
