import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { Toolbar } from '@mui/material';
import { FormProvider, PersonalStep } from '../app-account-create/components';
import type { PersonalFormStep } from '../../models/form/PersonalFormStep';
import { useForm, type SubmitHandler } from 'react-hook-form';
import RoleStep from '../../components/RoleStep';
import { userService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import type { UserResponse } from '../../models/response/UserResponse';
import type { UserUpdateRequest } from '../../models/request/UserUpdateRequest';

export default function AppUserEdit() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState<UserResponse | null>(null);

  // Extend PersonalFormStep to include roles
  interface UserEditForm extends PersonalFormStep {
    roles: string[];
  }

  const formMethods = useForm<UserEditForm>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roles: []
    }
  });

  const { handleSubmit } = formMethods;

  // Load user data from API
  useEffect(() => {
    const loadUser = async () => {
      if (!userId || !currentUser?.accountId) return;
      
      try {
        setLoading(true);
        const user = await userService.getById(currentUser.accountId, Number(userId));
        setUserData(user);
        
        // Set form values when user data loads
        formMethods.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          personalDescription: user.description,
          roles: user.roles.map(role => role.id.toString())
        });
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load user data');
        navigate('/app/users');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, currentUser?.accountId, formMethods, navigate]);

  // Helper function to check if user has root role
  const isRootUser = (user: UserResponse | null): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.name?.toLowerCase() === 'root' || 
      role.name?.toLowerCase() === 'admin' ||
      role.name?.toLowerCase() === 'super admin' ||
      role.name?.toLowerCase() === 'system admin'
    );
  };


  const handleSave: SubmitHandler<UserEditForm> = async (data) => {
    if (userData && currentUser?.accountId) {
      
      // Prevent saving for root users
      if (isRootUser(userData)) {
        toast.error('Cannot modify users with administrative privileges for security reasons.');
        return;
      }
      
      setSaving(true);
      try {
        const updateRequest: UserUpdateRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: '',
          roleIds: data.roles.map(roleId => Number(roleId))
        };

        await userService.update(currentUser.accountId, Number(userId), updateRequest);
        toast.success('User updated successfully!');
        
        // Navigate back to user summary
        setTimeout(() => {
          navigate(`/app/users/${userId}`);
        }, 1500);
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    navigate(`/app/users/${userId}`);
  };

  const handleViewSummary = () => {
    navigate(`/app/users/${userId}`);
  };

  return (

    <>
      <Paper elevation={2}>
        <Toolbar className='toolbar'>
          <div className='toolbar-action'>
            <IconButton size='medium' onClick={handleCancel} sx={{ p: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Edit User
            </Typography>
          </div>
        </Toolbar>
      </Paper>

      <div className="page-content">
        {loading ?
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Skeleton variant="text" width="150px" height={28} sx={{ mb: 2 }} />
                <Stack spacing={3}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={56} />
                  ))}
                </Stack>
              </Paper>
            </Stack>

            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Skeleton variant="text" width="120px" height={28} sx={{ mb: 2 }} />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={36} sx={{ mb: 2 }} />
                ))}
              </Paper>
            </Stack>
          </Box> :
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              {/* Main Form */}
              <FormProvider {...formMethods} >
                <form id="user-edit-form" onSubmit={handleSubmit(handleSave)}>
                  <Stack spacing={3}>
                    {/* Personal Information */}
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6">
                          Personal Information
                        </Typography>
                      </Stack>
                      <Stack>
                        <PersonalStep mode='edit' />
                      </Stack>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <SecurityIcon color="primary" />
                        <Typography variant="h6">
                          Role Information
                        </Typography>
                        {isRootUser(userData) && (
                          <Chip 
                            label="Protected User" 
                            color="warning" 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Stack>
                      <Stack>
                        <RoleStep readOnly={isRootUser(userData)} />
                        {isRootUser(userData) && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            This user has administrative privileges. Role assignments cannot be modified to maintain system security.
                          </Alert>
                        )}
                      </Stack>
                    </Paper>
                  </Stack>
                </form>
              </FormProvider>

              {/* Sidebar */}
              <Stack spacing={3}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Current Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={userData?.status}
                        color={userData?.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {userData?.email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleViewSummary}
                    >
                      View User Summary
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/app/users')}
                    >
                      All Users
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/app/roles')}
                    >
                      Manage Roles
                    </Button>
                  </Stack>
                </Paper>

                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Security Actions
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="warning"
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="error"
                    >
                      Disable Account
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </>
        }

      </div>
      <Paper style={{ padding: '1rem', position: 'absolute', bottom: 0, width: '100%', zIndex: 2 }} elevation={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
            form="user-edit-form"
            disabled={saving || isRootUser(userData)}
            title={isRootUser(userData) ? 'Cannot modify users with administrative privileges' : undefined}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Paper>


    </ >
  );
}
