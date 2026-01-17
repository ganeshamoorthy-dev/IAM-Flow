import type { PermissionModel } from '../../models/core/Permission';
import { permissionMockHelpers } from '../data/permissions';

/**
 * Stub backend service for permission operations
 */
export class PermissionStubBackend {
  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET /api/v1/permissions/{id}
   */
  async getPermission(permissionId: number): Promise<PermissionModel> {
    await this.simulateDelay();

    const permission = permissionMockHelpers.getById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    return permission;
  }

  /**
   * GET /api/v1/permissions
   */
  async getPermissions(params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    resource?: string;
    scope?: 'GLOBAL' | 'ACCOUNT' | 'USER';
  }): Promise<PermissionModel[]> {
    await this.simulateDelay();

    const permissions = permissionMockHelpers.getAll();

    // Apply pagination
    const page = params?.page ?? 0;
    const size = params?.size ?? 20;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedPermissions = permissions.slice(startIndex, endIndex);

    return paginatedPermissions;
  }
}
