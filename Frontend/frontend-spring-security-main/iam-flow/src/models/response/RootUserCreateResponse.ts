import type { PermissionModel } from "../core/Permission";

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: PermissionModel[];
  accountId: number;  
  createdAt: string;
  updatedAt: string;
}

export interface RootUserCreateResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: 'PASSWORD' | 'SSO';
  accountId: number;
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
  roles: Role[];
}
