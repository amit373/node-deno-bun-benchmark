import type { TimestampFields } from './common.types.js';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_STUDENTS = 'MANAGE_STUDENTS',
  MANAGE_CLASSES = 'MANAGE_CLASSES',
  MANAGE_GRADES = 'MANAGE_GRADES',
  VIEW_STUDENTS = 'VIEW_STUDENTS',
  VIEW_CLASSES = 'VIEW_CLASSES',
  VIEW_GRADES = 'VIEW_GRADES',
  VIEW_REPORTS = 'VIEW_REPORTS',
  CREATE_GRADES = 'CREATE_GRADES',
  UPDATE_GRADES = 'UPDATE_GRADES',
  DELETE_GRADES = 'DELETE_GRADES',
  VIEW_OWN_GRADES = 'VIEW_OWN_GRADES',
  VIEW_CHILD_GRADES = 'VIEW_CHILD_GRADES',
}

export interface User extends TimestampFields {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}
