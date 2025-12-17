import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { studentRouter } from './student.routes.js';
import { classRouter } from './class.routes.js';
import { gradeRouter } from './grade.routes.js';
import { reportRouter } from './report.routes.js';

export const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/students', studentRouter);
router.use('/v1/classes', classRouter);
router.use('/v1/grades', gradeRouter);
router.use('/v1/reports', reportRouter);
