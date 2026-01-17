import { authService } from '.';
import type { Permission } from '../models/request/RoleCreateRequest';
import { apiClient } from './ApiClient';

/**
 * Permission Service
 * Handles permission management operations
 */
export class PermissionService {

  /**
   * Get all permissions
   * @returns Promise<Permission[]>
   * Fetches a list of all available permissions
   * This is a read-only operation
   */
  async list(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>(`/api/v1/permissions/list`,
      { headers: authService.getRequestHeaders() });
    return response.data;
  }
}
