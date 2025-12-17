import { Context } from 'oak';
import { JwtUtil } from '@student-api/shared-utils';
import { HTTP_STATUS, ERROR_MESSAGES } from '@student-api/shared-constants';

export const authenticate = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    const authHeader = ctx.request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.response.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.response.body = {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      };
      return;
    }

    const token = authHeader.substring(7);
    const decoded = JwtUtil.verifyAccessToken(token);
    
    // Attach user to context state
    ctx.state.user = decoded;
    
    await next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      ctx.response.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.response.body = {
        success: false,
        message: 'Token expired',
        timestamp: new Date().toISOString(),
      };
      return;
    }
    
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      ctx.response.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.response.body = {
        success: false,
        message: 'Invalid token',
        timestamp: new Date().toISOString(),
      };
      return;
    }
    
    throw error;
  }
};
