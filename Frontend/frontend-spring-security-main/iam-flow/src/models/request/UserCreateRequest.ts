export interface UserRole {
  id: number;
  name?: string;
  description?: string;
}

export interface UserCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  roles: UserRole[];
}
