import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsightsIcon from '@mui/icons-material/Insights';
import { accountService, userService, roleService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import type { AccountStats } from '../../models/response/AccountStats';
import type { UserResponse } from '../../models/response/UserResponse';
import type { RoleResponse } from '../../models/response/RoleResponse';

export default function AppDashboard() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState<AccountStats | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  
  // Insights data state
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate metrics loading
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        
        console.log('Loading dashboard metrics for account:', currentUser.accountId);
        const stats = await accountService.getStats(currentUser.accountId);
        console.log('Loaded dashboard metrics:', stats);
        
        setDashboardMetrics(stats);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
        setMetricsError('Failed to load dashboard metrics');
      } finally {
        setMetricsLoading(false);
      }
    };

    if (currentUser.accountId) {
      loadMetrics();
    }
  }, [currentUser.accountId]);

  // Load insights data (users and roles)
  useEffect(() => {
    const loadInsightsData = async () => {
      try {
        setInsightsLoading(true);
        setInsightsError(null);
        
        console.log('Loading insights data for account:', currentUser.accountId);
        
        const [usersData, rolesData] = await Promise.all([
          userService.list(currentUser.accountId),
          roleService.list(currentUser.accountId)
        ]);
        
        console.log('Loaded users:', usersData);
        console.log('Loaded roles:', rolesData);
        
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading insights data:', error);
        setInsightsError('Failed to load insights data');
      } finally {
        setInsightsLoading(false);
      }
    };

    if (currentUser.accountId) {
      loadInsightsData();
    }
  }, [currentUser.accountId]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'createUser':
        navigate('/app/users/create');
        break;
      case 'manageRoles':
        navigate('/app/roles');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Mock recent activity data (set empty to show "No activity" message)
  const recentActivity: Array<{
    action: string;
    time: string;
    type: string;
    severity: string;
  }> = [];
  
  // Uncomment below to show sample activities:
  // const recentActivity = [
  //   {
  //     action: 'User "Sarah Chen" enabled MFA',
  //     time: '2 minutes ago',
  //     type: 'security',
  //     severity: 'success'
  //   },
  //   {
  //     action: 'New user "Alex Rodriguez" invited',
  //     time: '1 hour ago',
  //     type: 'user',
  //     severity: 'info'
  //   },
  //   {
  //     action: 'Role "Project Manager" permissions updated',
  //     time: '3 hours ago',
  //     type: 'role',
  //     severity: 'info'
  //   },
  //   {
  //     action: '5 failed login attempts detected',
  //     time: '6 hours ago',
  //     type: 'security',
  //     severity: 'warning'
  //   },
  //   {
  //     action: 'Password policy updated',
  //     time: '1 day ago',
  //     type: 'policy',
  //     severity: 'info'
  //   }
  // ];



  // Insights calculation functions
  const calculateInsights = () => {
    if (!users.length || !roles.length || !dashboardMetrics) {
      return null;
    }

    // User engagement calculations
    const activeUserPercent = Math.round((dashboardMetrics.activeUsers / dashboardMetrics.totalUsers) * 100);
    const mfaAdoptionPercent = Math.round((dashboardMetrics.mfaEnabled / dashboardMetrics.totalUsers) * 100);
    
    // Role distribution
    const avgUsersPerRole = Math.round(dashboardMetrics.totalUsers / roles.length);
    
    // Security insights
    const securityScore = calculateSecurityScore();
    
    return {
      activeUserPercent,
      mfaAdoptionPercent,
      avgUsersPerRole,
      securityScore,
      totalRoles: roles.length,
      pendingInvites: dashboardMetrics.pendingInvitations,
      failedLogins: dashboardMetrics.failedLoginAttempts
    };
  };

  const calculateSecurityScore = () => {
    if (!dashboardMetrics) return 0;
    
    let score = 100;
    
    // Deduct points for security issues
    if (dashboardMetrics.failedLoginAttempts > 10) score -= 20;
    else if (dashboardMetrics.failedLoginAttempts > 5) score -= 10;
    
    if (dashboardMetrics.passwordExpiring > 0) score -= 15;
    
    const mfaPercent = (dashboardMetrics.mfaEnabled / dashboardMetrics.totalUsers) * 100;
    if (mfaPercent < 50) score -= 30;
    else if (mfaPercent < 80) score -= 15;
    
    if (dashboardMetrics.inactiveUsers > dashboardMetrics.activeUsers) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const insights = calculateInsights();

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 3, mb: 4 }}>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </Box>
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Skeleton variant="text" width="150px" height={28} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#ffffff', borderRadius: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60px" height={16} />
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Skeleton variant="text" width="120px" height={28} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} />
                    <Skeleton variant="text" width="90%" height={16} />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        {/* Security Alert */}
        {dashboardMetrics && dashboardMetrics.failedLoginAttempts > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>{dashboardMetrics.failedLoginAttempts} failed login attempts</strong> detected in the last 24 hours. 
            Consider reviewing security logs.
          </Alert>
        )}

        {/* Metrics Error Alert */}
        {metricsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {metricsError}
          </Alert>
        )}

        {/* Metrics Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="primary">
                        {dashboardMetrics?.totalUsers || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </>
                  )}
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="success.main">
                        {dashboardMetrics?.activeUsers || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </>
                  )}
                </Box>
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="info.main">
                        {dashboardMetrics?.mfaEnabled || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        MFA Enabled
                      </Typography>
                    </>
                  )}
                </Box>
                <ShieldIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="warning.main">
                        {dashboardMetrics?.pendingInvitations || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Invites
                      </Typography>
                    </>
                  )}
                </Box>
                <MailOutlineIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="error.main">
                        {dashboardMetrics?.failedLoginAttempts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Failed Logins
                      </Typography>
                    </>
                  )}
                </Box>
                <WarningIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  {metricsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h4" color="warning.main">
                        {dashboardMetrics?.passwordExpiring || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Passwords Expiring
                      </Typography>
                    </>
                  )}
                </Box>
                <VpnKeyIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Insights Section */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <InsightsIcon color="primary" />
            Account Insights
          </Typography>
          
          {insightsLoading || metricsLoading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                      <Skeleton variant="circular" width={60} height={60} sx={{ mx: 'auto', mb: 2 }} />
                      <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : insightsError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {insightsError}
            </Alert>
          ) : insights ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              {/* User Engagement */}
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      background: `conic-gradient(#4caf50 ${insights.activeUserPercent * 3.6}deg, #e0e0e0 0deg)`
                    }}>
                      <Box sx={{ 
                        width: 45, 
                        height: 45, 
                        borderRadius: '50%', 
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="caption" fontWeight="bold" color="success.main">
                          {insights.activeUserPercent}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      User Engagement
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active users rate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Security Score */}
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <ShieldIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: insights.securityScore >= 80 ? 'success.main' : 
                                 insights.securityScore >= 60 ? 'warning.main' : 'error.main',
                          mx: 'auto'
                        }} 
                      />
                      <Typography 
                        variant="caption" 
                        fontWeight="bold"
                        sx={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: insights.securityScore >= 80 ? 'success.main' : 
                                 insights.securityScore >= 60 ? 'warning.main' : 'error.main'
                        }}
                      >
                        {insights.securityScore}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Security Score
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall security health
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* MFA Adoption */}
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <VpnKeyIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: insights.mfaAdoptionPercent >= 80 ? 'success.main' : 
                                 insights.mfaAdoptionPercent >= 50 ? 'warning.main' : 'error.main',
                          mx: 'auto'
                        }} 
                      />
                      <Chip
                        label={`${insights.mfaAdoptionPercent}%`}
                        size="small"
                        color={insights.mfaAdoptionPercent >= 80 ? 'success' : 
                               insights.mfaAdoptionPercent >= 50 ? 'warning' : 'error'}
                        sx={{ position: 'absolute', top: -8, right: -8 }}
                      />
                    </Box>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      MFA Adoption
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Two-factor authentication
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Role Distribution */}
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <BarChartIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Role Distribution
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Roles:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {insights.totalRoles}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Avg Users/Role:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {insights.avgUsersPerRole}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          {/* Recent Activity */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color="primary" />
              Recent Activity
            </Typography>
            <Stack spacing={2}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#ffffff', 
                    borderRadius: 1,
                    borderLeft: 4,
                    borderLeftColor: activity.severity === 'warning' ? 'warning.main' : 
                                   activity.severity === 'success' ? 'success.main' : 'info.main'
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {activity.severity === 'warning' && <WarningIcon color="warning" fontSize="small" />}
                      {activity.severity === 'success' && <CheckCircleIcon color="success" fontSize="small" />}
                      {activity.type === 'security' && activity.severity !== 'warning' && activity.severity !== 'success' && 
                        <SecurityIcon color="info" fontSize="small" />}
                      {activity.type === 'user' && <PeopleIcon color="info" fontSize="small" />}
                      {activity.type === 'role' && <AdminPanelSettingsIcon color="info" fontSize="small" />}
                      {activity.type === 'policy' && <SettingsIcon color="info" fontSize="small" />}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="inherit" />
                          {activity.time}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                  borderRadius: 2,
                  border: (theme) => `1px dashed ${theme.palette.divider}`
                }}>
                  <AccessTimeIcon
                    sx={{
                      fontSize: 48,
                      color: 'text.secondary',
                      mb: 1
                    }}
                  />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    No Recent Activity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    System activity will appear here when available
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Quick Actions */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminPanelSettingsIcon color="primary" />
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Tooltip title="Add a new user to your organization">
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                  onClick={() => handleQuickAction('createUser')}
                >
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Create New User
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add a new user to your account
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>
              
              <Tooltip title="Manage user roles and permissions">
                <Button
                  variant="outlined"
                  startIcon={<AdminPanelSettingsIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                  onClick={() => handleQuickAction('manageRoles')}
                >
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Manage Roles
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Create or edit user roles
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>
          
            </Stack>
          </Paper>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Paper>
        <Toolbar className="toolbar">
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
          <Chip
            label="Live Data"
            color="success"
            size="small"
            icon={<CheckCircleIcon />}
          />
        </Toolbar>
      </Paper>

      <div className="page-content">
        {renderDashboardContent()}
      </div>
    </>
  );
}
