import type { AccountCreateResponse } from '../../models/response/AccountCreateResponse';
import type { AccountGetResponse } from '../../models/response/AccountGetResponse';
import type { AccountStats } from '../../models/response/AccountStats';
import type { AccountCreateRequest } from '../../services';
import { accountMockHelpers } from '../data/accounts';

/**
 * Stub backend service for account operations
 */
export class AccountStubBackend {

  private simulateDelay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET /api/v1/accounts/{id}
   */
  async getAccount(accountId: number): Promise<AccountGetResponse> {
    await this.simulateDelay();

    const account = accountMockHelpers.getById(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    return account;
  }


  /**
   * POST /api/v1/accounts
   */
  async createAccount(accountData: AccountCreateRequest): Promise<AccountCreateResponse> {
    await this.simulateDelay(500);

    const newAccount = accountMockHelpers.create(accountData);
    return newAccount;
  }


  /**
   * GET /api/v1/accounts/{id}/stats
   */
  async getAccountStats(accountId: number): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalRoles: number;
    pendingInvitations: number;
  }> {
    await this.simulateDelay();
    console.log(`Fetching stats for account ID ${accountId}`);
    // Mock stats - in real implementation, this would query related data
    return {
      totalUsers: 12,
      activeUsers: 10,
      totalRoles: 4,
      pendingInvitations: 2
    };
  }

  async delete(accountId: number) {
    console.log(`account deletion initiated..${accountId}`);
    await this.simulateDelay();
  }

  async stats(accountId: number): Promise<AccountStats> {
    await this.simulateDelay();
    console.log("Fetched details of account", accountId);
    return {
      totalUsers: 2,
      activeUsers: 2,
      inactiveUsers: 0,
      failedLoginAttempts: 0,
      passwordExpiring: 0,
      pendingInvitations: 0,
      mfaEnabled: 0
    };
  }
}
