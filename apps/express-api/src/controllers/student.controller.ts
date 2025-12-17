import type { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service.js';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@student-api/shared-constants';
import { asyncWrapper } from '@student-api/shared-middleware';

export class StudentController {
  static getAll = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await StudentService.getAll({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    res.json(ResponseFormatter.success(result));
  });

  static getById = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const student = await StudentService.getById(id);
    res.json(ResponseFormatter.success(student));
  });

  static create = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const student = await StudentService.create(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(ResponseFormatter.success(student, SUCCESS_MESSAGES.CREATED));
  });

  static update = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const student = await StudentService.update(id, req.body);
    res.json(ResponseFormatter.success(student, SUCCESS_MESSAGES.UPDATED));
  });

  static delete = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    await StudentService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
