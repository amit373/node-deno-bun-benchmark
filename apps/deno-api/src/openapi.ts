import {
  commonSchemas,
  authSchemas,
  studentSchemas,
  classSchemas,
  gradeSchemas,
} from './swagger/schemas.ts';
import { authPaths, studentPaths, classPaths, gradePaths, reportPaths } from './swagger/paths.ts';

// Build OpenAPI spec from modular components
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Student Management API - Deno',
    version: '1.0.0',
    description: 'Production-ready Student Management API built with Deno + Oak + MongoDB',
    contact: {
      name: 'API Support',
      email: 'support@studentapi.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Deno API Development Server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Students', description: 'Student management endpoints' },
    { name: 'Classes', description: 'Class management endpoints' },
    { name: 'Grades', description: 'Grade management endpoints' },
    { name: 'Reports', description: 'Performance report endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
    },
    schemas: {
      ...commonSchemas,
      ...authSchemas,
      ...studentSchemas,
      ...classSchemas,
      ...gradeSchemas,
    },
  },
  paths: {
    ...authPaths,
    ...studentPaths,
    ...classPaths,
    ...gradePaths,
    ...reportPaths,
  },
};
