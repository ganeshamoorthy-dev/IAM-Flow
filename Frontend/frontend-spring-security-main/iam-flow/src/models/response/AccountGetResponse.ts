export interface AccountGetResponse {
  id: number;
  name: string;
  description?: string;
  type: 'ORGANIZATION' | 'INDIVIDUAL';
  status: 'CREATED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  currentLogin: string;
  lastLogin: string;
  userStatus: 'CREATED' | 'ACTIVE' | 'INACTIVE' ;
}
