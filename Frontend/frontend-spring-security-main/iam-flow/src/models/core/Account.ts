export interface Account {
  id: number;
  name: string;
  description: string;
  type: 'ORGANIZATION' | 'PERSONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'CREATED';
  createdAt: string;
  updatedAt: string;
}
