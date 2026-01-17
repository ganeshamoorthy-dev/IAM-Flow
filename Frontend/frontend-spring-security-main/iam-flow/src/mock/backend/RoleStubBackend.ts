import { roleMockHelpers } from '../data/roles';
import type { RoleCreateRequest } from '../../services';
import type { Role } from '../../models/response/RootUserCreateResponse';
import type { RoleResponse } from '../../models/response/RoleResponse';

/**
 * Stub backend service for role operations
 */
export class RoleStubBackend {
  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET /api/v1/accounts/{accountId}/roles/{id}
   */
  async getRole(accountId: number, roleId: number): Promise<Role> {
    await this.simulateDelay();

    const role = roleMockHelpers.getById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    if (role.accountId !== accountId) {
      throw new Error(`Role ${roleId} does not belong to account ${accountId}`);
    }

    return role;
  }

  /**
   * GET /api/v1/accounts/{accountId}/roles
   */
  async getRoles(accountId: number, params?: {
    page?: number;
    size?: number;
    search?: string;
    type?: 'SYSTEM' | 'CUSTOM';
  }): Promise<RoleResponse[]> {
    await this.simulateDelay();

    let roles = roleMockHelpers.getByAccountId(accountId);

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      roles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm) ||
        role.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedRoles = roles.slice(startIndex, endIndex);

    return paginatedRoles;
  }

  /**
   * POST /api/v1/accounts/{accountId}/roles
   */
  async createRole(accountId: number, roleData: RoleCreateRequest): Promise<Role> {
    await this.simulateDelay(500);

    // Check if role already exists
    const existingRole = roleMockHelpers.getByName(roleData.name as string, accountId);
    if (existingRole) {
      throw new Error(`Role with name '${roleData.name}' already exists in this account`);
    }

    const newRole = roleMockHelpers.create(roleData as Omit<Role, 'id' | 'createdAt' | 'updatedAt'>);

    return newRole;
  }

  /**
   * PUT /api/v1/accounts/{accountId}/roles/{id}
   */
  async updateRole(accountId: number, roleId: number, updates: RoleCreateRequest): Promise<Role> {
    await this.simulateDelay(300);

    const existingRole = roleMockHelpers.getById(roleId);
    if (!existingRole) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    if (existingRole.accountId !== accountId) {
      throw new Error(`Role ${roleId} does not belong to account ${accountId}`);
    }

    const updatedRole = roleMockHelpers.update(roleId, updates);
    if (!updatedRole) {
      throw new Error(`Failed to update role ${roleId}`);
    }

    return updatedRole;
  }

  /**
   * DELETE /api/v1/accounts/{accountId}/roles/{id}
   */
  async deleteRole(accountId: number, roleId: number): Promise<void> {
    await this.simulateDelay(400);

    const role = roleMockHelpers.getById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    if (role.accountId !== accountId) {
      throw new Error(`Role ${roleId} does not belong to account ${accountId}`);
    }

    const deleted = roleMockHelpers.delete(roleId);
    if (!deleted) {
      throw new Error(`Failed to delete role ${roleId}`);
    }
  }
}
