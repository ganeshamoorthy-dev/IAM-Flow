import type { AccountCreateResponse } from "../../models/response/AccountCreateResponse";
import type { AccountGetResponse } from "../../models/response/AccountGetResponse";
import type { AccountCreateRequest } from "../../services";

/**
 * Mock data for accounts
 */
export const mockAccounts: AccountGetResponse[] = [
  {
    id: 1, name: "commvault", description: "test-account", type: "ORGANIZATION", status: "CREATED", createdAt: new Date().toISOString(), updatedAt: "0",
    email: "admin@company.com",
    firstName: "admin",
    lastName: "",
    middleName: "",
    currentLogin: "2025-09-20T17:11:41.613925Z",
    lastLogin: "2025-09-20T06:13:19.973353Z",
    userStatus: "CREATED"
  }
];

/**
 * Helper functions for mock account operations
 */
export const accountMockHelpers = {

  getById: (id: number): AccountGetResponse => {
    return mockAccounts.find(account => account.id === id) as AccountGetResponse;
  },

  create: (accountData: AccountCreateRequest): AccountCreateResponse => {
    const newAccount: AccountCreateResponse = {
      name: accountData.name,
      description: accountData.description,
      type: accountData.type,
      status: 'CREATED',
      id: Math.max(...mockAccounts.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: "ganeshamoorthya@gmail.com",
      userId: 1
    };
    return newAccount;
  }
};
