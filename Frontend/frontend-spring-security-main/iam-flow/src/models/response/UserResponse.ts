import type { UserRole } from "../request/UserCreateRequest";

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: 'PASSWORD' | 'SSO';
  accountId: number;
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  currentLogin: string;
  lastLogin: string;
  middleName: string;
  roles: UserRole[];
  description:string;
}
