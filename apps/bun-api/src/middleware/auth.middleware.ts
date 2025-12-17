import { Elysia } from 'elysia';
import { JwtUtil } from '@student-api/shared-utils';
import { HTTP_STATUS, ERROR_MESSAGES, ROLE_PERMISSIONS } from '@student-api/shared-constants';
import { Permission, TokenPayload } from '@student-api/shared-types';

export const authPlugin = new Elysia({ name: 'auth' })
  .derive(({ headers }): { user: TokenPayload | null } => {
    const authHeader = headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { user: null };
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = JwtUtil.verifyAccessToken(token);
      return { user: decoded };
    } catch {
      return { user: null };
    }
  });

export const requireAuth = new Elysia({ name: 'require-auth' })
  .use(authPlugin)
  .onBeforeHandle(({ user, set }): void | { success: boolean; message: string; timestamp: string } => {
    if (!user) {
      set.status = HTTP_STATUS.UNAUTHORIZED;
      return {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      };
    }
  });

export const requirePermission = (...permissions: Permission[]): ReturnType<typeof Elysia> => {
  return new Elysia({ name: 'require-permission' })
    .use(authPlugin)
    .onBeforeHandle(({ user, set }): void | { success: boolean; message: string; timestamp: string } => {
      if (!user) {
        set.status = HTTP_STATUS.UNAUTHORIZED;
        return {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
          timestamp: new Date().toISOString(),
        };
      }

      const userPermissions = ROLE_PERMISSIONS[user.role] || [];
      const hasPermission = permissions.some((permission: Permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        set.status = HTTP_STATUS.FORBIDDEN;
        return {
          success: false,
          message: ERROR_MESSAGES.FORBIDDEN,
          timestamp: new Date().toISOString(),
        };
      }
    });
};
