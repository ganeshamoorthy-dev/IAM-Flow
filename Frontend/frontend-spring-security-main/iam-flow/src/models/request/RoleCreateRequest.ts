export interface Permission {
  id: number;
  name: string;
}

export interface RoleCreateRequest {
  name: string;
  description: string;
  permissions: Permission[];
}
