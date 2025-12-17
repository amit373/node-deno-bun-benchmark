import swaggerJsdoc from 'swagger-jsdoc';
import { Config } from '@student-api/shared-config';

function getSwaggerOptions(): swaggerJsdoc.Options {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Student Management API - Express',
        version: '1.0.0',
        description:
          'Production-ready Student Management API built with Node.js 22 + Express + MongoDB',
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
          url: `http://localhost:${Config.port}`,
          description: 'Development server',
        },
        {
          url: 'http://localhost:3000',
          description: 'Express API (Node.js 22)',
        },
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
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  code: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Students',
        description: 'Student management endpoints',
      },
      {
        name: 'Classes',
        description: 'Class management endpoints',
      },
      {
        name: 'Grades',
        description: 'Grade management endpoints',
      },
      {
        name: 'Reports',
        description: 'Performance report endpoints',
      },
    ],
    },
    apis: ['./src/routes/*.ts'],
  };
}

export function getSwaggerSpec(): Record<string, unknown> {
  return swaggerJsdoc(getSwaggerOptions()) as Record<string, unknown>;
}
