export interface RoleUpdateRequest {
  name: string;
  description: string;
  permissions: PermissionRequest[];
}

export interface PermissionRequest {
  id: number;
  name: string;
  description: string;
}
