import { Router } from 'oak';
import { AuthController } from '../controllers/auth.controller.ts';
import { LoginSchema, RefreshTokenSchema } from '@student-api/shared-zod-schemas';
import { authenticate } from '../middleware/auth.middleware.ts';

export const authRouter = new Router({ prefix: '/api/v1/auth' });

authRouter.post('/login', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validated = LoginSchema.parse(body);
  ctx.response.body = await AuthController.login(validated);
});

authRouter.post('/refresh', async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;
  const validated = RefreshTokenSchema.parse(body);
  ctx.response.body = await AuthController.refresh(validated);
});

authRouter.get('/me', authenticate, async (ctx) => {
  const authHeader = ctx.request.headers.get('Authorization');
  ctx.response.body = await AuthController.me(authHeader!);
});
