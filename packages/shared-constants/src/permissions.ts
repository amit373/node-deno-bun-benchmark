import { Permission } from '@student-api/shared-types';

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.MANAGE_USERS]: 'Create, update, and delete users',
  [Permission.MANAGE_STUDENTS]: 'Create, update, and delete students',
  [Permission.MANAGE_CLASSES]: 'Create, update, and delete classes',
  [Permission.MANAGE_GRADES]: 'Full access to grade management',
  [Permission.VIEW_STUDENTS]: 'View student information',
  [Permission.VIEW_CLASSES]: 'View class information',
  [Permission.VIEW_GRADES]: 'View all grades',
  [Permission.VIEW_REPORTS]: 'View performance reports',
  [Permission.CREATE_GRADES]: 'Create new grades',
  [Permission.UPDATE_GRADES]: 'Update existing grades',
  [Permission.DELETE_GRADES]: 'Delete grades',
  [Permission.VIEW_OWN_GRADES]: 'View own grades only',
  [Permission.VIEW_CHILD_GRADES]: 'View child grades only',
};
