export interface ResendOtpRequest {
  email: string;
  accountId?: number;
  isRoot?: boolean;
}
