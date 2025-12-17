import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES } from '@student-api/shared-constants';
import { asyncWrapper } from '@student-api/shared-middleware';

export class AuthController {
  static login = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(ResponseFormatter.success(result, SUCCESS_MESSAGES.LOGIN_SUCCESS));
  });

  static refresh = asyncWrapper((req: Request, res: Response, _next: NextFunction) => {
    const { refreshToken } = req.body;
    const result = AuthService.refreshToken(refreshToken);
    res.json(ResponseFormatter.success(result, SUCCESS_MESSAGES.TOKEN_REFRESHED));
  });

  static me = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const user = await AuthService.getCurrentUser(userId);
    res.json(ResponseFormatter.success(user));
  });
}
