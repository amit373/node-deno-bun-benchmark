import { Context } from 'oak';
import { ZodSchema, ZodError } from 'zod';
import { HTTP_STATUS } from '@student-api/shared-constants';

export const validateBody = (schema: ZodSchema) => {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    try {
      const body = await ctx.request.body({ type: 'json' }).value;
      const validated = schema.parse(body);
      ctx.state.validatedBody = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.response.status = HTTP_STATUS.BAD_REQUEST;
        ctx.response.body = {
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
        return;
      }
      throw error;
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    try {
      const validated = schema.parse(ctx.params);
      ctx.state.validatedParams = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.response.status = HTTP_STATUS.BAD_REQUEST;
        ctx.response.body = {
          success: false,
          message: 'Invalid parameters',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
        return;
      }
      throw error;
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    try {
      const params = ctx.request.url.searchParams;
      const query: Record<string, string | undefined> = {};
      
      // Only include params that have actual values
      for (const [key, value] of params.entries()) {
        if (value !== '' && value !== null && value !== undefined) {
          query[key] = value;
        }
      }
      
      const validated = schema.parse(query);
      ctx.state.validatedQuery = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.response.status = HTTP_STATUS.BAD_REQUEST;
        ctx.response.body = {
          success: false,
          message: 'Invalid query parameters',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
        return;
      }
      throw error;
    }
  };
};
