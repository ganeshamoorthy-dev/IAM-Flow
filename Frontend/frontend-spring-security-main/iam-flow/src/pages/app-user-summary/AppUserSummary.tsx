import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Menu, MenuItem, Toolbar } from '@mui/material';
import { userService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import type { UserResponse } from '../../models/response/UserResponse';
import type { UserRole } from '../../models/request/UserCreateRequest';

export default function AppUserSummary() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserResponse>();
  const currentUser = useCurrentUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Simulate loading
  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      setLoading(true);
      const user = await userService.getById(currentUser?.accountId, Number(userId));
      setUser(user);
    } catch (e) {
      toast.error("Unable to get the user now.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    navigate('/app/users');
  };

  const handleRoleClick = (role: UserRole) => {
    if (role?.name == "ROOT") return;
    navigate(`/app/roles/${role}`);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return;
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  async function enableUser() {
    try {
      await userService.enable(currentUser.accountId, Number(user?.id));
      setUser({ ...user!, status: 'ACTIVE' });
      toast.success("User enabled successfully");
    } catch (error) {
      console.error("Error enabling user:", error);
      toast.error("Failed to enable user");
    }
    setAnchorEl(null); // Close menu
  }

  async function disableUser() {
    try {
      await userService.disable(currentUser.accountId, Number(user?.id));
      setUser({ ...user!, status: 'INACTIVE' });
      toast.success("User disabled successfully");
    } catch (error) {
      console.error("Error disabling user:", error);
      toast.error("Failed to disable user");
    }
    setAnchorEl(null); // Close menu
  }

  // const getActivityIcon = (type: string) => {
  //   switch (type) {
  //     case 'login':
  //       return <PersonIcon fontSize="small" />;
  //     case 'security':
  //       return <SecurityIcon fontSize="small" />;
  //     case 'profile':
  //       return <EditIcon fontSize="small" />;
  //     default:
  //       return <AccessTimeIcon fontSize="small" />;
  //   }
  // };

  return (

    <>
      <Paper>
        <Toolbar className='toolbar'>
          <div className='toolbar-action'>
            <IconButton size='medium' onClick={handleBack} sx={{ p: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              User
            </Typography>

          </div>

          <div>
            <Button onClick={handleClick}>
              Actions
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => navigate('/app/users/' + user?.id + '/edit')}>
                <EditIcon fontSize="small" sx={{ mr: 2 }} /> EDIT
              </MenuItem>
              {user?.status === "ACTIVE" ? (
                <MenuItem onClick={disableUser}>
                  <BlockIcon fontSize="small" sx={{ mr: 2 }} /> DISABLE
                </MenuItem>
              ) : (
                <MenuItem onClick={enableUser}>
                  <CheckCircleIcon fontSize="small" sx={{ mr: 2 }} /> ENABLE
                </MenuItem>
              )}
              <MenuItem onClick={() => navigate('/app/users/')}>
                <DeleteIcon fontSize="small" color='error' sx={{ mr: 2 }} /> DELETE
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>

      </Paper>
      <Box className='page-content'>

        {loading ?

          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <Stack spacing={3}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Skeleton variant="text" width="150px" height={28} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    {[...Array(6)].map((_, i) => (
                      <Box key={i}>
                        <Skeleton variant="text" width="80px" height={20} />
                        <Skeleton variant="text" width="120px" height={24} />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Stack>

              <Stack spacing={3}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Skeleton variant="text" width="120px" height={28} sx={{ mb: 2 }} />
                  {[...Array(4)].map((_, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="60px" height={16} />
                    </Box>
                  ))}
                </Paper>
              </Stack>
            </Box>
          </Box> :

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            {/* Main Content */}
            <Stack spacing={3}>
              {/* Personal Information */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Personal Information
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user?.firstName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user?.lastName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body1">
                        {user?.email}
                      </Typography>
                      {user?.status === "ACTIVE" ? (
                        <Tooltip title="Email verified">
                          <CheckCircleIcon color="success" fontSize="small" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Email not verified">
                          <ErrorIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(user?.lastLogin)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Login
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(user?.currentLogin)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              {/* Permissions */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Roles
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.roles.map((role) => (
                    role.name === "ROOT" ? (
                      <Tooltip
                        key={role.id}
                        title="Account Owner - System role with full privileges"
                        arrow
                      >
                        <Chip
                          label="OWNER"
                          variant="outlined"
                          size="small"
                          color="warning"
                        />
                      </Tooltip>
                    ) : (
                      <Chip
                        onClick={() => handleRoleClick(role)}
                        key={role.id}
                        label={role.name}
                        variant="outlined"
                        size="small"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                    )
                  ))}
                </Box>
              </Paper>
            </Stack>

            {/* Sidebar */}
            <Stack spacing={3}>
              {/* Quick Stats */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {/* {user.permissions.length} */} 0
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permissions
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {/* {userData.recentActivity.length} */} 0
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recent Activities
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Activity
                </Typography>
                <Stack spacing={2}>
                  {/* {userData.recentActivity.map((activity, index) => (
                    <Box key={index} sx={{
                      p: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#ffffff',
                      borderRadius: 1,
                      borderLeft: 3,
                      borderLeftColor: activity.type === 'security' ? 'warning.main' : 'info.main'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {getActivityIcon(activity.type)}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="inherit" />
                            {formatDateTime(activity.timestamp)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))} */}

                  {/* No recent activity message */}
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
                      User activity will appear here when available
                    </Typography>
                  </Box>

                </Stack>
              </Paper>
            </Stack>
          </Box>
        }
      </Box>
    </>
  );
}
