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
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import { Menu, MenuItem, Toolbar } from '@mui/material';
import { roleService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import type { RoleResponse } from '../../models/response/RoleResponse';

export default function AppRoleSummary() {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [roleData, setRoleData] = useState<RoleResponse | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Load role data from API
  useEffect(() => {
    const loadRole = async () => {
      if (!roleId || !currentUser?.accountId) return;
      
      try {
        setLoading(true);
        const role = await roleService.getById(currentUser.accountId, Number(roleId));
        setRoleData(role);
      } catch (error) {
        console.error('Error loading role:', error);
        toast.error('Failed to load role data');
        navigate('/app/roles');
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, [roleId, currentUser?.accountId, navigate]);

  // Mock recent role activity (keeping this as static data for now)
  const recentActivity: Array<{
    action: string;
    timestamp: string;
    type: string;
    user: string;
  }> = [];
  // Uncomment below to show sample activity:
  // const recentActivity = [
  //   {
  //     action: 'Role permissions updated',
  //     timestamp: '2024-08-24T09:15:00Z',
  //     type: 'permission',
  //     user: 'System'
  //   },
  //   {
  //     action: 'User assigned to role',
  //     timestamp: '2024-08-23T16:30:00Z',
  //     type: 'assignment',
  //     user: 'Admin'
  //   },
  //   {
  //     action: 'Role description updated',
  //     timestamp: '2024-08-22T11:20:00Z',
  //     type: 'update',
  //     user: 'Admin User'
  //   }
  // ];

  const handleBack = () => {
    navigate('/app/roles');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'permission':
        return <SecurityIcon fontSize="small" />;
      case 'assignment':
        return <PersonIcon fontSize="small" />;
      case 'update':
        return <EditIcon fontSize="small" />;
      case 'creation':
        return <AdminPanelSettingsIcon fontSize="small" />;
      default:
        return <AccessTimeIcon fontSize="small" />;
    }
  };

  return (
    <>
      <Paper>
        <Toolbar className='toolbar'>
          <div className='toolbar-action'>
            <IconButton size='medium' onClick={handleBack} sx={{ p: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Role
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
              <MenuItem onClick={() => roleData && navigate('/app/roles/' + roleData.id + '/edit')}>
                <EditIcon fontSize="small" sx={{ mr: 2 }} /> EDIT
              </MenuItem>
              <MenuItem onClick={() => navigate('/app/roles/')}>
                <DeleteIcon fontSize="small" color='error' sx={{ mr: 2 }} /> DELETE
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </Paper>

      <Box className='page-content'>
        {loading ? (
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
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            {/* Main Content */}
            <Stack spacing={3}>
              {/* Role Information */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Role Information
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {roleData?.name || 'Unknown Role'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {roleData?.accountId || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {roleData?.description || 'No description available'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {roleData?.id || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role Type
                    </Typography>
                    <Chip
                      label="Custom Role"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Permissions */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Permissions ({roleData?.permissions?.length || 0})
                </Typography>
                
                {/* Professional Chip Design */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {roleData?.permissions?.map((permission, index) => (
                    <Chip
                      key={index}
                      label={permission.name}
                      variant="outlined"
                      size="small"
                      color="primary"
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.75rem'
                      }}
                    />
                  )) || <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>}
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
                        {roleData?.permissions?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permissions
                      </Typography>
                    </Box>
                    <Box sx={{ height: 1, bgcolor: 'divider' }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        N/A
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Users Assigned
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <Box key={index} sx={{
                        p: 2,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#ffffff',
                        borderRadius: 1,
                        borderLeft: 3,
                        borderLeftColor: activity.type === 'permission' ? 'warning.main' : 
                                       activity.type === 'assignment' ? 'success.main' : 'info.main'
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {getActivityIcon(activity.type)}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon fontSize="inherit" />
                              {formatDateTime(activity.timestamp)} by {activity.user}
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
                        Role activity will appear here when available
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
}
