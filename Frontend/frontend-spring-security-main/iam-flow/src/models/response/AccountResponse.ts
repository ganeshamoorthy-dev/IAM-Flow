export interface AccountResponse {
  id: number;
  name: string;
  description?: string;
  type: 'ORGANIZATION' | 'INDIVIDUAL';
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
