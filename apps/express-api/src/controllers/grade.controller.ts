import type { Request, Response, NextFunction } from 'express';
import { GradeService } from '../services/grade.service.js';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@student-api/shared-constants';
import { asyncWrapper } from '@student-api/shared-middleware';

export class GradeController {
  static getByStudent = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const grades = await GradeService.getByStudentId(id);
    res.json(ResponseFormatter.success(grades));
  });

  static create = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const teacherId = req.user!.userId;
    const grade = await GradeService.create({ ...req.body, teacherId });
    res
      .status(HTTP_STATUS.CREATED)
      .json(ResponseFormatter.success(grade, SUCCESS_MESSAGES.CREATED));
  });

  static update = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const grade = await GradeService.update(id, req.body);
    res.json(ResponseFormatter.success(grade, SUCCESS_MESSAGES.UPDATED));
  });

  static delete = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    await GradeService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
