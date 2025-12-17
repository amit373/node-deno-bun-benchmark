import { AuthService } from '../services/auth.service';
import { JwtUtil } from '@student-api/shared-utils';

export class AuthController {
  static async login(body: { email: string; password: string }): Promise<{ success: boolean; data: { accessToken: string; refreshToken: string; user: { id: string; email: string; firstName: string; lastName: string } } }> {
    const result = await AuthService.login(body.email, body.password);
    return { success: true, data: result };
  }

  static refresh(body: { refreshToken: string }): { success: boolean; data: { accessToken: string } } {
    const result = AuthService.refreshToken(body.refreshToken);
    return { success: true, data: { accessToken: result.accessToken } };
  }

  static async me(headers: Record<string, string | undefined>): Promise<{ success: boolean; data: { id: string; email: string; role: string; permissions: string[]; firstName: string; lastName: string } }> {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }
    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);
    const user = await AuthService.getCurrentUser(payload.userId);
    return { success: true, data: user };
  }
}
