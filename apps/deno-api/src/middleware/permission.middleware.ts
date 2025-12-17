import { Context } from 'oak';
import { Permission, UserRole } from '@student-api/shared-types';
import { ROLE_PERMISSIONS, HTTP_STATUS, ERROR_MESSAGES } from '@student-api/shared-constants';

export const checkPermission = (...requiredPermissions: Permission[]) => {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    if (!ctx.state.user) {
      ctx.response.status = HTTP_STATUS.UNAUTHORIZED;
      ctx.response.body = {
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      };
      return;
    }

    const userRole = ctx.state.user?.role as UserRole;
    const userPermissions = userRole ? (ROLE_PERMISSIONS[userRole] || []) : [];
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      ctx.response.status = HTTP_STATUS.FORBIDDEN;
      ctx.response.body = {
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        timestamp: new Date().toISOString(),
      };
      return;
    }

    await next();
  };
};
