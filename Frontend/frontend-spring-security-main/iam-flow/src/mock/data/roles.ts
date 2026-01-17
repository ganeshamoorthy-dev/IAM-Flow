/**
 * Mock data for roles
 */
import type { Role } from "../../models/response/RootUserCreateResponse";

export const mockRoles = [
   {
    id: 1,
    name: "USER READ",
    description: "This role can make CRUD to users",
    accountId: 1,
    permissions: [
      { "id": 2, "name": "IAM:USER:READ" },
    ], 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "USER MANAGER",
    description: "This role can make CRUD to users",
    accountId: 1,
    permissions: [
      { "id": 1, "name": "IAM:USER:CREATE" },
      { "id": 2, "name": "IAM:USER:READ" },
      { "id": 3, "name": "IAM:USER:UPDATE" },
      { "id": 4, "name": "IAM:USER:DELETE" }
    ], 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Helper functions for mock role operations
 */
export const roleMockHelpers = {
  
  getById: (id: number): Role  => {
    return mockRoles.find(role => role.id === id) as Role;
  },

  getByAccountId: (accountId: number): Role[] => {
    return mockRoles.filter(role => role.accountId === accountId);
  },

  getByName: (name: string, accountId: number): Role | undefined => {
    return mockRoles.find(role => role.name === name && role.accountId === accountId);
  },

  create: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role => {
    const newRole: Role = {
      ...roleData,
      id: Math.max(...mockRoles.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRoles.push(newRole);
    return newRole;
  },

  update: (id: number, updates: Partial<Role>): Role | null => {
    const index = mockRoles.findIndex(role => role.id === id);
    if (index === -1) return null;

    mockRoles[index] = {
      ...mockRoles[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    return mockRoles[index];
  },

  delete: (id: number): boolean => {
    const index = mockRoles.findIndex(role => role.id === id);
    if (index === -1) return false;

    mockRoles.splice(index, 1);
    return true;
  },

  getAll: (): Role[] => {
    return [...mockRoles];
  }
};
