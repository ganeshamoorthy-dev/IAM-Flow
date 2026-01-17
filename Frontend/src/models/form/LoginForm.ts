export interface LoginForm {
  email: string;
  password: string;
  accountId?: string; // Optional for root user login
  loginType: 'user' | 'root';
}
