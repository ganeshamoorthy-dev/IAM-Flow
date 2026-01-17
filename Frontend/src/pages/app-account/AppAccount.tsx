import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { accountService, authService } from '../../services';
import type { AccountStats } from '../../models/response/AccountStats';
import type { AccountGetResponse } from '../../models/response/AccountGetResponse';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function AppAccount() {
  const [accountData, setAccountData] = useState<AccountGetResponse>();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsData, setStatsData] = useState<AccountStats>();
  const currentUser = useCurrentUser();


  useEffect(() => {
    if (!currentUser?.accountId) return;

    async function getAccountDetails() {
      setLoading(true);
      try {
        const accountData = await accountService.getAccount(currentUser.accountId);
        setAccountData(accountData);
        setLoading(false);
      } catch (e) {
        console.log(e);
        toast.error("Failed to load the data");
        setLoading(false);
      }
    }

    async function getAccountStats() {
      setStatsLoading(true);
      try {
        const currentUserData = await authService.getCurrentUser();
        const stats = await accountService.getStats(currentUserData.accountId);
        setStatsData(stats);
        setStatsLoading(false);
      } catch (e) {
        console.log(e);
        toast.error("Failed to load stats");
        setStatsLoading(false);
      }
    }

    getAccountDetails();
    getAccountStats();
  }, [currentUser?.accountId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const renderAccountContent = () => {
    if (loading) {
      return (
        <Box>
          <Skeleton variant="text" width="200px" height={40} sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 2 }}>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Skeleton variant="text" width="250px" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={1} sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="120px" height={24} />
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 3 }}>
                <Skeleton variant="text" width="200px" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={1} sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {[...Array(6)].map((_, i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="80px" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="120px" height={24} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, minWidth: '280px' }}>
              <Stack spacing={2}>
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent>
                      <Skeleton variant="text" width="60px" height={32} />
                      <Skeleton variant="text" width="100px" height={20} />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Account Information */}
          <Box sx={{ flex: 2 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {accountData?.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Chip
                      label={accountData?.type}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {accountData?.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={accountData?.status}
                      color="success"
                      variant="outlined"
                      size="small"
                      icon={<CheckCircleIcon />}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(accountData?.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Updated Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(accountData?.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Root User Details */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    Root User Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {accountData?.firstName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {accountData?.lastName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {accountData?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Verification Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={accountData?.status == "ACTIVE" ? "Email is verified" : "Email needs verification"}>
                        <CheckCircleIcon
                          fontSize="small"
                          color={accountData?.status === "ACTIVE" ? "success" : "error"}
                        />
                      </Tooltip>
                      <Chip
                        label={accountData?.status === "ACTIVE" ? "Verified" : "Unverified"}
                        color={accountData?.status === "ACTIVE" ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Chip
                      label="Owner"
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(accountData?.lastLogin)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Account Stats Sidebar */}
          <Box sx={{ flex: 1, minWidth: '280px' }}>
            <Stack spacing={2}>
              <Card sx={{ position: 'relative', overflow: 'visible' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {statsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} sx={{ mx: 'auto' }} />
                      <Skeleton variant="text" width="100px" height={20} sx={{ mx: 'auto' }} />
                    </>
                  ) : (
                    <>
                      <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary" component="div">
                        {statsData?.totalUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  {statsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} sx={{ mx: 'auto' }} />
                      <Skeleton variant="text" width="100px" height={20} sx={{ mx: 'auto' }} />
                    </>
                  ) : (
                    <>
                      <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main" component="div">
                        {statsData?.activeUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  {statsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} sx={{ mx: 'auto' }} />
                      <Skeleton variant="text" width="100px" height={20} sx={{ mx: 'auto' }} />
                    </>
                  ) : (
                    <>
                      <SecurityIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="info.main" component="div">
                        {statsData?.inactiveUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Disabled Users
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  {statsLoading ? (
                    <>
                      <Skeleton variant="text" width="60px" height={32} sx={{ mx: 'auto' }} />
                      <Skeleton variant="text" width="100px" height={20} sx={{ mx: 'auto' }} />
                    </>
                  ) : (
                    <>
                      <MailOutlineIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="warning.main" component="div">
                        {statsData?.pendingInvitations}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Invitations
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    );
  };



  return (
    <>
      <Paper>
        <Toolbar className="toolbar">
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
        </Toolbar>
      </Paper>

      <div className="page-content">
        {renderAccountContent()}
      </div>
    </>
  );
}
