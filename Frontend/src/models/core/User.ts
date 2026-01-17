import type { PermissionModel } from "./Permission";
export interface UserModel {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  description: string;
  email: string;
  roles: PermissionModel[];
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
  type: 'SSO' | 'PASSWORD';
  accountId: number;
  createdAt: string;
  updatedAt: string;
  currentLogin: string;
  lastLogin: string;
  additionalAttributes?: Record<string, unknown>;
}
