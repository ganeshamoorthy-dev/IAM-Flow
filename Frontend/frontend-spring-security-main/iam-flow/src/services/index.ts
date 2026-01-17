// Export all services
export { AccountService } from './AccountService';
export { AuthService } from './AuthService';
export { UserService } from './UserService';
export { RoleService } from './RoleService';
export { PermissionService } from './PermissionService';
export { apiClient } from './ApiClient';

// Export service instances for easy usage
import { AccountService } from './AccountService';
import { AuthService } from './AuthService';
import { UserService } from './UserService';
import { RoleService } from './RoleService';
import { PermissionService } from './PermissionService';

// Create service instances
export const accountService = new AccountService();
export const authService = new AuthService();
export const userService = new UserService();
export const roleService = new RoleService();
export const permissionService = new PermissionService();

// Account types
export type { AccountCreateRequest } from '../models/request/AccountCreateRequest';
export type { AccountResponse } from '../models/response/AccountResponse';

// User types
export type { RootUserCreateRequest } from '../models/request/RootUserCreateRequest';
export type { RootUserCreateResponse } from '../models/response/RootUserCreateResponse';
export type { UserCreateRequest } from '../models/request/UserCreateRequest';

// Auth types
export type { OtpValidationRequest } from '../models/request/OtpValidationRequest';
export type { OtpValidationResponse } from '../models/response/OtpValidationResponse';
export type { SetPasswordRequest } from '../models/request/SetPasswordRequest';
export type { RootLoginRequest } from '../models/request/RootLoginRequest';
export type { LoginRequest } from '../models/request/LoginRequest';

// Role types
export type { RoleCreateRequest } from '../models/request/RoleCreateRequest';
export type { RoleResponse as RoleCreateResponse } from '../models/response/RoleResponse';

