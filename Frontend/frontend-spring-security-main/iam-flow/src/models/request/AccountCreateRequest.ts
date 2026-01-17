export interface AccountCreateRequest {
  name: string;
  description?: string;
  type: 'ORGANIZATION' | 'INDIVIDUAL';
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  userDescription?: string;
}
