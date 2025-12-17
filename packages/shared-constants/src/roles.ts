import { UserRole, Permission } from '@student-api/shared-types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_STUDENTS,
    Permission.MANAGE_CLASSES,
    Permission.MANAGE_GRADES,
    Permission.VIEW_STUDENTS,
    Permission.VIEW_CLASSES,
    Permission.VIEW_GRADES,
    Permission.VIEW_REPORTS,
    Permission.CREATE_GRADES,
    Permission.UPDATE_GRADES,
    Permission.DELETE_GRADES,
  ],
  [UserRole.ADMIN]: [
    Permission.MANAGE_STUDENTS,
    Permission.MANAGE_CLASSES,
    Permission.VIEW_STUDENTS,
    Permission.VIEW_CLASSES,
    Permission.VIEW_GRADES,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.TEACHER]: [
    Permission.VIEW_STUDENTS,
    Permission.VIEW_CLASSES,
    Permission.VIEW_GRADES,
    Permission.CREATE_GRADES,
    Permission.UPDATE_GRADES,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.STUDENT]: [Permission.VIEW_OWN_GRADES, Permission.VIEW_CLASSES],
  [UserRole.PARENT]: [Permission.VIEW_CHILD_GRADES, Permission.VIEW_CLASSES],
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 5,
  [UserRole.ADMIN]: 4,
  [UserRole.TEACHER]: 3,
  [UserRole.PARENT]: 2,
  [UserRole.STUDENT]: 1,
};
