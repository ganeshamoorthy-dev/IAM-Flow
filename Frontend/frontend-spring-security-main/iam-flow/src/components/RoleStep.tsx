import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  Typography,
  Chip,
  CircularProgress
} from "@mui/material";
import type { RoleStepForm } from "../models/form/RoleStepForm";
import { useEffect, useState, useCallback } from "react";
import { roleService } from "../services";
import { useCurrentUser } from "../hooks/useCurrentUser";
// Add the following import or type definition for RolesResponse
import type { RoleResponse } from "../models/response/RoleResponse";
import { toast } from "react-toastify";

interface RoleStepProps {
  readOnly?: boolean;
}

export default function RoleStep({ readOnly = false }: RoleStepProps) {

  const { control } = useFormContext<RoleStepForm>();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser();


  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const roles: RoleResponse[] = await roleService.list(currentUser.accountId);
      setRoles(roles);
    } catch (e) {
      console.error(e);
      toast.error("Unable to fetch roles");
    } finally {
      setLoading(false);
    }
  }, [currentUser.accountId]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assign Roles
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select one or more roles for this user. Roles determine what actions the user can perform in the system.
      </Typography>
      <Controller
        name="roles"
        control={control}
        rules={{ required: "At least one role must be selected" }}
        render={({ field, fieldState }) => {
          if (!field) {
            console.error('Field is undefined in RoleStep Controller');
            return (
              <FormControl fullWidth error>
                <FormHelperText>Error: Field is undefined</FormHelperText>
              </FormControl>
            );
          }
          
          return (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel id="role-select-label">Roles</InputLabel>
              <Select
                labelId="role-select-label"
                multiple
                value={field.value || []}
                onChange={(event) => {
                  if (readOnly) return; // Prevent changes when read-only
                  const value = event.target.value;
                  // Handle the case where the value is not an array (shouldn't happen with multiple select)
                  if (!Array.isArray(value)) return;
                  field.onChange(value);
                }}
                disabled={loading || readOnly}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => {
                  if (!Array.isArray(selected) || roles.length === 0) return null;
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((roleId) => {
                        if (!roleId) return null;
                        // Find role by matching both string and number formats
                        const role = roles.find(r => 
                          r.id.toString() === roleId.toString() || 
                          r.id === Number(roleId)
                        );
                        const roleName = role?.name;
                        
                        // Debug logging to help identify issues
                        if (!role && !loading) {
                          console.warn(`Role not found for ID: ${roleId}`, {
                            searchId: roleId,
                            availableRoles: roles.map(r => ({ id: r.id, name: r.name }))
                          });
                        }
                        
                        return (
                          <Chip
                            key={roleId}
                            label={roleName || `Role ${roleId}`}
                            variant="outlined"
                            size="small"
                            onDelete={readOnly ? undefined : () => {
                              const newValue = (field.value || []).filter((id: string) => id !== roleId);
                              field.onChange(newValue);
                            }}
                            onMouseDown={(event) => {
                              event.stopPropagation();
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
            >
              {loading ? (
                <MenuItem key="loading" disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', py: 2 }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="body2">Loading roles...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                [
                  <MenuItem
                    key="select-all"
                    dense
                    disabled={readOnly}
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                    onClick={(event) => {
                      if (readOnly) return;
                      // Prevent the Select from closing
                      event.stopPropagation();
                      const allSelected = (field.value || []).length === roles.length;
                      // Toggle between all selected and none selected
                      field.onChange(allSelected ? [] : roles.map((role) => role.id.toString()));
                    }}
                  >
                    <Checkbox
                      checked={(field.value || []).length === roles.length}
                      indeterminate={(field.value || []).length > 0 && (field.value || []).length < roles.length}
                      disabled={readOnly}
                      onClick={(event) => {
                        if (readOnly) return;
                        // Prevent triggering the MenuItem click
                        event.stopPropagation();
                        const target = event.target as HTMLInputElement;
                        field.onChange(target.checked ? roles.map((role) => role.id.toString()) : []);
                      }}
                    />
                    <ListItemText
                      primary={(field.value || []).length === roles.length ? "Deselect All" : "Select All"}
                    />
                  </MenuItem>
                ].concat(
                  roles.map((role) => (
                    <MenuItem
                      key={role.id}
                      value={role.id.toString()}
                      disabled={readOnly}
                      onClick={(event) => {
                        if (readOnly) return;
                        // Prevent the Select from closing
                        event.stopPropagation();
                        const currentValue = field.value || [];
                        const roleIdStr = role.id.toString();
                        const newValue = currentValue.includes(roleIdStr)
                          ? currentValue.filter((id: string) => id !== roleIdStr)
                          : [...currentValue, roleIdStr];
                        field.onChange(newValue);
                      }}
                    >
                      <Checkbox
                        checked={(field.value || []).includes(role.id.toString())}
                        disabled={readOnly}
                        onClick={(event) => {
                          if (readOnly) return;
                          // Prevent triggering the MenuItem click
                          event.stopPropagation();
                          const target = event.target as HTMLInputElement;
                          const currentValue = field.value || [];
                          const roleIdStr = role.id.toString();
                          const newValue = target.checked
                            ? [...currentValue, roleIdStr]
                            : currentValue.filter((id: string) => id !== roleIdStr);
                          field.onChange(newValue);
                        }}
                      />
                      <ListItemText primary={role.name} />
                    </MenuItem>
                  ))
                )
              )}
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          );
        }}
      />
    </Box>
  );
}
