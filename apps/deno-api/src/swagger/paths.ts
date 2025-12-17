// Helper function to create standard responses
const createResponse = (description: string, schemaRef?: string) => ({
  description,
  ...(schemaRef && {
    content: {
      'application/json': {
        schema: { $ref: schemaRef },
      },
    },
  }),
});

const createErrorResponse = (description: string) =>
  createResponse(description, '#/components/schemas/Error');

// Auth paths
export const authPaths = {
  '/api/v1/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticate user with email and password',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        '200': createResponse('Login successful', '#/components/schemas/LoginResponse'),
        '401': createErrorResponse('Invalid credentials'),
      },
    },
  },
  '/api/v1/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description: 'Get new access token using refresh token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
          },
        },
      },
      responses: {
        '200': createResponse('Token refreshed successfully'),
        '401': createErrorResponse('Invalid refresh token'),
      },
    },
  },
  '/api/v1/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get current user',
      description: 'Get authenticated user information',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': createResponse('User information retrieved'),
        '401': createErrorResponse('Unauthorized'),
      },
    },
  },
};

// Student paths
export const studentPaths = {
  '/api/v1/students': {
    get: {
      tags: ['Students'],
      summary: 'Get all students',
      description: 'Retrieve paginated list of students',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
        { name: 'sortBy', in: 'query', schema: { type: 'string' } },
        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
      ],
      responses: {
        '200': createResponse('List of students retrieved'),
        '401': createErrorResponse('Unauthorized'),
      },
    },
    post: {
      tags: ['Students'],
      summary: 'Create new student',
      description: 'Create a new student record',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateStudentRequest' },
          },
        },
      },
      responses: {
        '201': createResponse('Student created successfully', '#/components/schemas/Student'),
        '400': createErrorResponse('Validation error'),
        '401': createErrorResponse('Unauthorized'),
      },
    },
  },
  '/api/v1/students/{id}': {
    get: {
      tags: ['Students'],
      summary: 'Get student by ID',
      description: 'Retrieve a single student by UUID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Student retrieved', '#/components/schemas/Student'),
        '404': createErrorResponse('Student not found'),
      },
    },
    put: {
      tags: ['Students'],
      summary: 'Update student',
      description: 'Update student information',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateStudentRequest' },
          },
        },
      },
      responses: {
        '200': createResponse('Student updated'),
        '404': createErrorResponse('Student not found'),
      },
    },
    delete: {
      tags: ['Students'],
      summary: 'Delete student',
      description: 'Delete a student record',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '204': { description: 'Student deleted' },
        '404': createErrorResponse('Student not found'),
      },
    },
  },
};

// Class paths (simplified)
export const classPaths = {
  '/api/v1/classes': {
    get: {
      tags: ['Classes'],
      summary: 'Get all classes',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
      ],
      responses: {
        '200': createResponse('List of classes'),
      },
    },
    post: {
      tags: ['Classes'],
      summary: 'Create new class',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateClassRequest' },
          },
        },
      },
      responses: {
        '201': createResponse('Class created'),
      },
    },
  },
  '/api/v1/classes/{id}': {
    get: {
      tags: ['Classes'],
      summary: 'Get class by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Class retrieved'),
      },
    },
    put: {
      tags: ['Classes'],
      summary: 'Update class',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Class updated'),
      },
    },
    delete: {
      tags: ['Classes'],
      summary: 'Delete class',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '204': { description: 'Class deleted' },
      },
    },
  },
};

// Grade paths
export const gradePaths = {
  '/api/v1/grades/student/{id}': {
    get: {
      tags: ['Grades'],
      summary: 'Get grades by student ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Student grades retrieved'),
      },
    },
  },
  '/api/v1/grades': {
    post: {
      tags: ['Grades'],
      summary: 'Create new grade',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGradeRequest' },
          },
        },
      },
      responses: {
        '201': createResponse('Grade created'),
      },
    },
  },
  '/api/v1/grades/{id}': {
    put: {
      tags: ['Grades'],
      summary: 'Update grade',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Grade updated'),
      },
    },
    delete: {
      tags: ['Grades'],
      summary: 'Delete grade',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '204': { description: 'Grade deleted' },
      },
    },
  },
};

// Report paths
export const reportPaths = {
  '/api/v1/reports/student/{id}': {
    get: {
      tags: ['Reports'],
      summary: 'Get student report',
      description: 'Get comprehensive student report',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': createResponse('Student report retrieved'),
      },
    },
  },
};
