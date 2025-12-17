import type { Request, Response, NextFunction } from 'express';
import { ClassService } from '../services/class.service.js';
import { ResponseFormatter } from '@student-api/shared-utils';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '@student-api/shared-constants';
import { asyncWrapper } from '@student-api/shared-middleware';

export class ClassController {
  static getAll = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await ClassService.getAll({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    res.json(ResponseFormatter.success(result));
  });

  static getById = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const classData = await ClassService.getById(id);
    res.json(ResponseFormatter.success(classData));
  });

  static create = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const classData = await ClassService.create(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(ResponseFormatter.success(classData, SUCCESS_MESSAGES.CREATED));
  });

  static update = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const classData = await ClassService.update(id, req.body);
    res.json(ResponseFormatter.success(classData, SUCCESS_MESSAGES.UPDATED));
  });

  static delete = asyncWrapper(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    await ClassService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
