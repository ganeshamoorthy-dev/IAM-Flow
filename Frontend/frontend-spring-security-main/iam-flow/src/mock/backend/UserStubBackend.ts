import type { UserUpdateRequest } from '../../models/request/UserUpdateRequest';
import type { UserResponse } from '../../models/response/UserResponse';
import type { SetPasswordRequest, UserCreateRequest } from '../../services';
import { userMockHelpers } from '../data/users';

/**
 * Stub backend service for user operations
 */
export class UserStubBackend {
  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET /api/v1/accounts/{accountId}/users/{id}
   */
  async getUser(accountId: number, userId: number): Promise<UserResponse> {
    await this.simulateDelay();

    const user = userMockHelpers.getById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (user.accountId !== accountId) {
      throw new Error(`User ${userId} does not  belong to account ${accountId}`);
    }

    return user;
  }

  /**
   * GET /api/v1/accounts/{accountId}/users
   */
  async getUsers(accountId: number, params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<UserResponse[]> {
    await this.simulateDelay();

    let users = userMockHelpers.getByAccountId(accountId);

    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      users = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (params?.status) {
      users = users.filter(user => user.status === params.status);
    }

    // Apply pagination
    const page = params?.page ?? 0;
    const size = params?.size ?? 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedUsers = users.slice(startIndex, endIndex);
    return paginatedUsers;
  }

  /**
   * POST /api/v1/accounts/{accountId}/users
   */
  async createUser(accountId: number, userData: UserCreateRequest): Promise<UserResponse> {
    await this.simulateDelay(500);

    const newUser = userMockHelpers.create(accountId, userData);

    return newUser;
  }

  /**
   * PUT /api/v1/accounts/{accountId}/users/{id}
   */
  async updateUser(accountId: number, userId: number, updates: UserUpdateRequest): Promise<UserResponse> {
    await this.simulateDelay(300);

    const existingUser = userMockHelpers.getById(userId);
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (existingUser.accountId !== accountId) {
      throw new Error(`User ${userId} does not belong to account ${accountId}`);
    }

    const updatedUser = userMockHelpers.update(userId, updates);
    if (!updatedUser) {
      throw new Error(`Failed to update user ${userId}`);
    }

    return updatedUser;
  }

  /**
   * DELETE /api/v1/accounts/{accountId}/users/{id}
   */
  async deleteUser(accountId: number, userId: number): Promise<void> {
    await this.simulateDelay(400);

    const user = userMockHelpers.getById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (user.accountId !== accountId) {
      throw new Error(`User ${userId} does not belong to account ${accountId}`);
    }

    const deleted = userMockHelpers.delete(userId);
    if (!deleted) {
      throw new Error(`Failed to delete user ${userId}`);
    }
  }

  async setPassword(accountId: number, data: SetPasswordRequest): Promise<void> {
    await this.simulateDelay(400);
    console.log(accountId, data);

  }

  async enable(accountId: number, userId: number): Promise<void> {
    await this.simulateDelay(400);
    console.log(accountId, userId);
  }

  async disable(accountId: number, userId: number): Promise<void> {
    await this.simulateDelay(400);
    console.log(accountId, userId);
  }
}
