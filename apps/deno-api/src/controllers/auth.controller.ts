import { AuthService } from '../services/auth.service.ts';
import { ResponseFormatter, JwtUtil } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';

export class AuthController {
  static async login(body: { email: string; password: string }) {
    const result = await AuthService.login(body.email, body.password);
    return ResponseFormatter.success(result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
  }

  static async refresh(body: { refreshToken: string }) {
    const result = await AuthService.refreshToken(body.refreshToken);
    return ResponseFormatter.success(result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
  }

  static async me(authHeader: string | undefined) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }
    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);
    const user = await AuthService.getCurrentUser(payload.userId);
    return ResponseFormatter.success(user);
  }
}
