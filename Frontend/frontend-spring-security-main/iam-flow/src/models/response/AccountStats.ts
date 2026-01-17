export interface AccountStats {

  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  failedLoginAttempts: number;
  passwordExpiring: number;
  pendingInvitations: number;
  mfaEnabled: number;
}
