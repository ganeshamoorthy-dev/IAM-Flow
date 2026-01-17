import type { UserModel } from "../../models/core/User";
import type { UserResponse } from "../../models/response/UserResponse";
import type { UserCreateRequest } from "../../services";


export const mockUsers: UserResponse[] = [
  {
    id: 1,
    firstName: "ganesh",
    lastName: "moorthy",
    email: "ganeshamoorthy060@gmail.com",
    type: "PASSWORD",
    accountId: 1,
    status: "ACTIVE",
    roles: [{ id: 1, name: "ROOT", description: "Root role with all permissions" }],
    middleName: "dare",
    description: "test account",
    createdAt: "2025-09-20T06:13:19.973353Z",
    updatedAt: "2025-09-20T17:11:41.613925Z",
    currentLogin: "2025-09-20T06:13:19.973353Z",
    lastLogin: "2025-09-20T06:13:19.973353Z"
  },
  {
    id: 2,
    firstName: "dare",
    lastName: "",
    email: "dare@gmail.com",
    type: "PASSWORD",
    accountId: 1,
    status: "CREATED",
    roles: [{ id: 1, name: "ROOT", description: "Root role with all permissions" }],
    middleName: "dare",
    description: "test account",
    createdAt: "2025-09-20T06:13:19.973353Z",
    updatedAt: "2025-09-20T17:11:41.613925Z",
    currentLogin: "2025-09-20T06:13:19.973353Z",
    lastLogin: "2025-09-20T06:13:19.973353Z"
  },
    {
    id: 3,
    firstName: "adams",
    lastName: "moorthy",
    email: "adams@gmail.com",
    type: "PASSWORD",
    accountId: 1,
    status: "INACTIVE",
    roles: [{ id: 1, name: "ROOT", description: "Root role with all permissions" }],
    middleName: "dare",
    description: "test account",
    createdAt: "2025-09-20T06:13:19.973353Z",
    updatedAt: "2025-09-20T17:11:41.613925Z",
    currentLogin: "2025-09-20T06:13:19.973353Z",
    lastLogin: "2025-09-20T06:13:19.973353Z"
  },
];

/**
 * Helper functions for mock user operations
 */
export const userMockHelpers = {

  getById: (id: number): UserResponse | undefined => {
    return mockUsers.find(user => user.id === id) as UserResponse;
  },

  getByAccountId: (accountId: number): UserResponse[] => {
    return mockUsers.filter(user => user.accountId === accountId);
  },

  create: (accountId: number, userData: UserCreateRequest): UserResponse => {
    const newUser: UserResponse = {
      ...userData,
      accountId,
      id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      middleName: "",
      status: "CREATED",
      type: "PASSWORD",
      currentLogin: "",
      lastLogin: ""
    };
    mockUsers.push(newUser);
    return newUser;
  },

  update: (id: number, updates: Partial<UserModel>): UserResponse | null => {
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) return null;

    mockUsers[index] = {
      ...mockUsers[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    return mockUsers[index];
  },

  delete: (id: number): boolean => {
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) return false;

    mockUsers.splice(index, 1);
    return true;
  },

  getAll: (): UserResponse[] => {
    return [...mockUsers];
  }
};
