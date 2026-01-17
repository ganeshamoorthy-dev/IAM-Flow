/**
 * Mock data for permissions
 */

import type { PermissionModel } from "../../models/core/Permission";

export const mockPermissions = [
  // User Management Permissions
  {id: 1, name: "users.read", description: "View user information and profiles"},
  {id: 2, name: "users.write", description: "Create and update user accounts"},
  {id: 3, name: "users.delete", description: "Delete user accounts"},
  
  // Role Management Permissions
  {id: 4, name: "roles.read", description: "View roles and their permissions"},
  {id: 5, name: "roles.write", description: "Create and update roles"},
  {id: 6, name: "roles.delete", description: "Delete roles"},
  
  // Account Management Permissions
  {id: 7, name: "account.read", description: "View account information and settings"},
  {id: 8, name: "account.write", description: "Update account settings and configuration"},
  {id: 9, name: "account.delete", description: "Delete accounts"},
  
  // Content Management Permissions
  {id: 10, name: "content.read", description: "View content and documents"},
  {id: 11, name: "content.write", description: "Create and edit content"},
  {id: 12, name: "content.delete", description: "Delete content and documents"},
  
  // Analytics Permissions
  {id: 13, name: "analytics.read", description: "View analytics and reports"},
  {id: 14, name: "analytics.export", description: "Export analytics data"},
  
  // Support Permissions
  {id: 15, name: "support.read", description: "View support tickets and issues"},
  {id: 16, name: "support.write", description: "Create and update support tickets"},
  
  // System Administration Permissions
  {id: 17, name: "admin.full", description: "Full administrative access to all features"},
  {id: 18, name: "admin.system", description: "System configuration and maintenance"},
  {id: 19, name: "admin.security", description: "Security settings and audit logs"}
];



/**
 * Helper functions for mock permission operations
 */
export const permissionMockHelpers = {


  getById: (id: number): PermissionModel | undefined => {
    return mockPermissions.find(permission => permission.id === id);
  },


  getAll: (): PermissionModel[] => {
    return [...mockPermissions];
  }

};
