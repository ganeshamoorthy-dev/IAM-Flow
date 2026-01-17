import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import {
  Box,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Alert,
  Skeleton,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { RoleForm } from '../../components';
import { roleService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import type { RoleEditForm } from '../../models/form/RoleEditForm';
import type { RoleCreateRequest } from '../../models/request/RoleCreateRequest';
import { toast } from 'react-toastify';

export default function AppRoleEdit() {
  const navigate = useNavigate();
  const { roleId } = useParams<{ roleId: string; }>();
  const currentUser = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const formMethods = useForm<RoleEditForm>({
    mode: 'onChange'
  });

  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        if (!roleId) {
          setLoadError('Role ID is required');
          return;
        }

        console.log('Loading role data for ID:', roleId);
        const response = await roleService.getById(currentUser.accountId, Number(roleId));
        console.log('Loaded role data:', response);

        if (!response) {
          setLoadError('Role not found');
          return;
        }

        // Populate form with existing data
        reset({
          id: response.id.toString(),
          name: response.name,
          description: response.description,
          permissions: response.permissions.map(p => p.id.toString())
        });

      } catch (error) {
        console.error('Error loading role:', error);
        setLoadError('Failed to load role data');
      } finally {
        setIsLoading(false);
      }
    };

    if (roleId) {
      loadRoleData();
    }
  }, [roleId, reset, currentUser.accountId]);

  const handleBack = () => {

    navigate(`/app/roles/${roleId}`);
  };

  const handleUpdateRole: SubmitHandler<RoleEditForm> = async (data) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log('Updating role:', data);

      // Prepare the update request
      const updateRequest: Partial<RoleCreateRequest> = {
        name: data.name,
        description: data.description,
        permissions: data.permissions.map(permissionId => ({
          id: parseInt(permissionId),
          name: '' // This will be resolved on the backend
        }))
      };

      const response = await roleService.update(currentUser.accountId, Number(roleId), updateRequest);
      console.log('Role updated successfully:', response);

      // Show success message and navigate back
      toast.success('Role updated successfully!');
      navigate(`/app/roles/${roleId}`);

    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role. Please try again.');
      setSubmitError('Failed to update role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <Box>
        <Paper>
          <Toolbar className="toolbar">
            <div className="toolbar-action">
              <IconButton size="medium" onClick={handleBack} sx={{ p: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Edit Role
              </Typography>
            </div>
          </Toolbar>
        </Paper>
        <div className="page-content" style={{ maxWidth: 1024, margin: '0 auto' }}>
          <Alert severity="error">
            {loadError}
          </Alert>
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <Paper>
        <Toolbar className="toolbar">
          <div className="toolbar-action">
            <IconButton
              size="medium"
              onClick={handleBack}
              sx={{ p: 1 }}
              disabled={isSubmitting || isLoading}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              Edit Role
            </Typography>
          </div>
        </Toolbar>
      </Paper>

      <div className="page-content">
        <Box>
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}

          {isLoading ? (
            <Box>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Skeleton variant="text" height={32} width={200} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={120} />
              </Paper>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Skeleton variant="text" height={32} width={150} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} />
              </Paper>
            </Box>
          ) : (
            <FormProvider {...formMethods}>
              <form
                id="role-edit-form"
                onSubmit={handleSubmit(handleUpdateRole)}
              >
                <RoleForm isEditMode={true} />
              </form>
            </FormProvider>
          )}
        </Box>
      </div>
      {/* Save/Cancel Buttons */}
      <Paper style={{ padding: '1rem', position: 'absolute', bottom: 0, width: '100%', zIndex: 2 }} elevation={2} sx={{ p: 2, mt: 3 }} >
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveIcon />}
            type="submit"
            form="role-edit-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
