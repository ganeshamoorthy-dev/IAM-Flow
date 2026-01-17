import { useFormContext, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { permissionService } from '../services';
import type { RoleCreateForm } from '../models/form/RoleCreateForm';
import type { RoleEditForm } from '../models/form/RoleEditForm';
import type { PermissionModel } from '../models/core/Permission';

interface RoleFormProps {
  isEditMode?: boolean;
}

export default function RoleForm({
  isEditMode = false
}: RoleFormProps) {
  const {
    control,
    formState: { errors },
    watch
  } = useFormContext<RoleCreateForm | RoleEditForm>();

  const selectedPermissions = watch('permissions') || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<PermissionModel[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Fetch permissions on component mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        setPermissionError(null);
        const permissionData = await permissionService.list();
        setPermissions(permissionData);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        setPermissionError('Failed to load permissions. Please try again.');
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1.5fr'
        },
        gap: 3,
        mb: 3
      }}>
        {/* Role Information Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? 'Edit Role Information' : 'Role Information'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Role Name */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Role name is required',
                minLength: {
                  value: 2,
                  message: 'Role name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Role name must not exceed 50 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Role Name"
                  placeholder="Enter role name (e.g., Content Manager)"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                },
                maxLength: {
                  value: 200,
                  message: 'Description must not exceed 200 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  placeholder="Describe the role and its responsibilities"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />
          </Box>
        </Paper>

        {/* Permissions Section */}
        <Paper elevation={2} sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          maxHeight: '70vh'
        }}>
          <Typography variant="h6" gutterBottom>
            Permissions
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the permissions that users with this role should have. Be careful with administrative permissions.
          </Typography>

          {/* Selected Permissions Section */}
          {selectedPermissions.length > 0 && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50', 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.600' : 'grey.200' 
            }}>
              <Typography variant="subtitle2" gutterBottom color="primary.main">
                Selected Permissions ({selectedPermissions.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedPermissions.map((permissionId: string) => {
                  const permission = permissions.find(p => p.id.toString() === permissionId);
                  return (
                    <Box
                      key={permissionId}
                      sx={{
                        px: 1,
                        py: 0.25,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.800' : 'primary.100',
                        color: (theme) => theme.palette.mode === 'dark' ? 'primary.100' : 'primary.800',
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        border: '1px solid',
                        borderColor: (theme) => theme.palette.mode === 'dark' ? 'primary.600' : 'primary.300',
                        fontFamily: 'monospace'
                      }}
                    >
                      {permission?.name || `Permission ${permissionId}`}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Controller
              name="permissions"
              control={control}
              rules={{
                required: 'At least one permission must be selected',
                validate: (value) => {
                  if (!value || value.length === 0) {
                    return 'Please select at least one permission';
                  }
                  return true;
                }
              }}
              render={({ field: { onChange, value = [] } }) => (
                <FormControl error={!!errors.permissions} component="fieldset" fullWidth>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <FormLabel component="legend">Available Permissions *</FormLabel>
                    <Typography variant="caption" color="text.secondary">
                      {loadingPermissions ? (
                        'Loading permissions...'
                      ) : searchTerm ? (
                        `${filteredPermissions.length} of ${permissions.length} permissions`
                      ) : (
                        `${permissions.length} permissions`
                      )}
                    </Typography>
                  </Box>
                  {errors.permissions && (
                    <FormHelperText error sx={{ mt: 1, mx: 0 }}>
                      {errors.permissions.message}
                    </FormHelperText>
                  )}

                  {permissionError && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                      {permissionError}
                    </Alert>
                  )}

                  {/* Search Field */}
                  <TextField
                    size="small"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleClearSearch}
                            edge="end"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormGroup>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                      },
                      gap: 2,
                      mt: 2,
                      alignItems: 'start',
                      minHeight: '300px',
                      maxHeight: '50vh',
                      overflowY: 'auto',
                      pr: 1,
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.600' : 'grey.200',
                      borderRadius: 1,
                      p: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.25',
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f1f1f1',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#555' : '#c1c1c1',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#666' : '#a8a8a8',
                      },
                    }}>
                      {loadingPermissions ? (
                        <Box sx={{
                          gridColumn: '1 / -1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '200px',
                          textAlign: 'center'
                        }}>
                          <CircularProgress size={24} sx={{ mr: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            Loading permissions...
                          </Typography>
                        </Box>
                      ) : permissionError ? (
                        <Box sx={{
                          gridColumn: '1 / -1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '200px',
                          textAlign: 'center',
                          color: 'error.main'
                        }}>
                          <Typography variant="body2">
                            Failed to load permissions. Please refresh the page.
                          </Typography>
                        </Box>
                      ) : filteredPermissions.length === 0 ? (
                        <Box sx={{
                          gridColumn: '1 / -1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '200px',
                          textAlign: 'center',
                          color: 'text.secondary'
                        }}>
                          <Typography variant="body2">
                            {searchTerm ? `No permissions found matching "${searchTerm}"` : 'No permissions available'}
                          </Typography>
                        </Box>
                      ) : (
                        filteredPermissions.map((permission) => (
                          <Box
                            key={permission.id}
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.600' : 'grey.300',
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'primary.900' : 'primary.50'
                              }
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={value.includes(permission.id.toString())}
                                  onChange={(e) => {
                                    const permissionId = permission.id.toString();
                                    if (e.target.checked) {
                                      onChange([...value, permissionId]);
                                    } else {
                                      onChange(value.filter((id: string) => id !== permissionId));
                                    }
                                  }}
                                  name={permission.id.toString()}
                                  sx={{ alignSelf: 'flex-start' }}
                                />
                              }
                              label={
                                <Box sx={{ ml: 1 }}>
                                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                                    {permission.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                    {permission.description || 'No description available'}
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                margin: 0,
                                alignItems: 'flex-start',
                                width: '100%'
                              }}
                            />
                          </Box>
                        )))}
                    </Box>
                  </FormGroup>
                </FormControl>
              )}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
