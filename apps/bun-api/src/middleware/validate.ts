import type { Context } from 'elysia';
import { ZodSchema, ZodError } from 'zod';
import { HTTP_STATUS } from '@student-api/shared-constants';

export const validateBody = (schema: ZodSchema) => {
  return ({ body, set }: Context): unknown => {
    try {
      const validated = schema.parse(body) as unknown;
      return validated;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(
            (err: { path: (string | number)[]; message: string; code: string }) => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })
          ),
        };
      }
      throw error;
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return ({ params, set }: Context): unknown => {
    try {
      const validated = schema.parse(params) as unknown;
      return validated;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          message: 'Invalid parameters',
          errors: error.errors.map(
            (err: { path: (string | number)[]; message: string; code: string }) => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })
          ),
        };
      }
      throw error;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return ({ query, set }: Context): unknown => {
    try {
      const validated = schema.parse(query) as unknown;
      return validated;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          message: 'Invalid query parameters',
          errors: error.errors.map(
            (err: { path: (string | number)[]; message: string; code: string }) => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })
          ),
        };
      }
      throw error;
    }
  };
};
