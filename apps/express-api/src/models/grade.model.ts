import mongoose, { Schema, Document } from 'mongoose';
import { GradeCategory } from '@student-api/shared-types';

export interface IGrade extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  assignmentName: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  gradeDate: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const gradeSchema = new Schema<IGrade>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignmentName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['HOMEWORK', 'QUIZ', 'TEST', 'EXAM', 'PROJECT', 'PARTICIPATION'],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    letterGrade: {
      type: String,
      required: true,
    },
    gradeDate: {
      type: Date,
      required: true,
    },
    comments: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ studentId: 1, classId: 1 });
gradeSchema.index({ classId: 1 });
gradeSchema.index({ teacherId: 1 });
gradeSchema.index({ gradeDate: -1 });

export const GradeModel = mongoose.model<IGrade>('Grade', gradeSchema);
