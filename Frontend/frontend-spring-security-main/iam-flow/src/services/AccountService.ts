import { apiClient } from './ApiClient';
import type { AccountCreateRequest } from '../models/request/AccountCreateRequest';
import type { AccountStats } from '../models/response/AccountStats';
import type { AccountGetResponse } from '../models/response/AccountGetResponse';
import { authService } from '.';
import type { AccountCreateResponse } from '../models/response/AccountCreateResponse';

/**
 * Account Service
 * Handles account-related operations including account creation and root user setup
 */
export class AccountService {

  /**
   * Create a new account
   * @param request Account creation data
   * @returns Promise<AccountCreateResponse>
   */
  async createAccount(request: AccountCreateRequest): Promise<AccountCreateResponse> {
    const response = await apiClient.post<AccountCreateResponse, AccountCreateRequest>(
      '/api/v1/accounts/create',
      request
    );
    return response.data;
  }

  /**
   * Get account by ID
   * @param accountId Account ID
   * @returns Promise<AccountCreateResponse>
   */
  async getAccount(accountId: number): Promise<AccountGetResponse> {
    const response = await apiClient.get<AccountGetResponse>(`/api/v1/accounts/${accountId}`,
      { headers: authService.getRequestHeaders() });
    return response.data;
  }

  /**
   * Delete account
   * @param accountId Account ID
   * @returns Promise<void>
   */
  async deleteAccount(accountId: number): Promise<void> {
    await apiClient.delete<void>(`/api/v1/accounts/${accountId}`);
  }


  /**
   * Get account stats
   * @param accountId 
   * @returns 
   */
  async getStats(accountId: number) {
    const response = await apiClient.get<AccountStats>(`/api/v1/accounts/${accountId}/stats`,
      { headers: authService.getRequestHeaders() });
    return response.data;
  }

}
