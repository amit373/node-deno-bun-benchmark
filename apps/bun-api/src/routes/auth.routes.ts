import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
import { LoginSchema, RefreshTokenSchema } from '@student-api/shared-zod-schemas';
import { requireAuth } from '../middleware/auth.middleware';

export const authRoutes = new Elysia({ prefix: '/auth', tags: ['Auth'] })
  .post(
    '/login',
    async ({ body }) => {
      const validated = LoginSchema.parse(body);
      return AuthController.login(validated);
    },
    {
      detail: {
        summary: 'Login user',
        description: 'Authenticate user with email and password',
        tags: ['Auth'],
      },
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        password: t.String({ minLength: 8, description: 'User password (min 8 characters)' }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            accessToken: t.String(),
            refreshToken: t.String(),
            user: t.Object({
              id: t.String(),
              email: t.String(),
              firstName: t.String(),
              lastName: t.String(),
            }),
          }),
        }),
      },
    }
  )
  .post(
    '/refresh',
    ({ body }) => {
      const validated = RefreshTokenSchema.parse(body);
      return AuthController.refresh(validated);
    },
    {
      detail: {
        summary: 'Refresh access token',
        description: 'Get new access token using refresh token',
        tags: ['Auth'],
      },
      body: t.Object({
        refreshToken: t.String({ description: 'Valid refresh token' }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            accessToken: t.String(),
          }),
        }),
      },
    }
  )
  .use(requireAuth)
  .get('/me', async ({ headers }) => AuthController.me(headers), {
    detail: {
      summary: 'Get current user',
      description: 'Get authenticated user information',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
    },
    response: {
      200: t.Object({
        success: t.Boolean(),
        data: t.Object({
          id: t.String(),
          email: t.String(),
          firstName: t.String(),
          lastName: t.String(),
          role: t.String(),
        }),
      }),
    },
  });
