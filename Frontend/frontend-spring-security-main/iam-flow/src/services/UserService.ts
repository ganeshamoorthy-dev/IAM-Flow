import { apiClient } from './ApiClient';
import type { UserCreateRequest } from '../models/request/UserCreateRequest';
import type { ListQueryParams } from '../models/common/StandardTypes';
import { UrlUtils } from '../utils/UrlUtils';
import type { UserResponse } from '../models/response/UserResponse';
import type { UserUpdateRequest } from '../models/request/UserUpdateRequest';
import type { SetPasswordRequest } from '../models/request/SetPasswordRequest';
import { authService } from '.';

/**
 * User Service Implementation
 * Handles user management operations following standard practices
 */
export class UserService {

  async create(accountId: number, request: UserCreateRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      `/api/v1/accounts/${accountId}/users/create`,
      request,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }

  async getById(accountId: number, id: number): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(
      `/api/v1/accounts/${accountId}/users/${id}`,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }

  async update(accountId: number, id: number, request: UserUpdateRequest): Promise<UserResponse> {
    const response = await apiClient.patch<UserResponse>(
      `/api/v1/accounts/${accountId}/users/${id}`,
      request,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }


  async enable(accountId: number, id: number): Promise<void> {
    const response = await apiClient.patch<void>(`/api/v1/accounts/${accountId}/users/${id}/enable`,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }


  async disable(accountId: number, id: number): Promise<void> {
    const response = await apiClient.patch<void>(`/api/v1/accounts/${accountId}/users/${id}/disable`,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }

  async delete(accountId: number, id: number): Promise<void> {
    const response = await apiClient.delete<void>(
      `/api/v1/accounts/${accountId}/users/${id}`,
      { headers: authService.getRequestHeaders() }
    );
    return response.data;
  }

  async list(accountId: number, params?: ListQueryParams): Promise<UserResponse[]> {
    const url = UrlUtils.buildUrl<ListQueryParams>(
      `/api/v1/accounts/${accountId}/users/list`,
      params
    );
    const response = await apiClient.get<UserResponse[]>(url, { headers: authService.getRequestHeaders() });
    return response.data;
  }


  async setPassword(accountId: number, request: SetPasswordRequest) {
    const response = await apiClient.patch(`/api/v1/accounts/${accountId}/users/set-password`, request);
    return response.data;
  }
}
