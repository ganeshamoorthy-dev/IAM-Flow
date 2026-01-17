import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { AccountType } from "../../../models/form/AccountCreateForm";
import { useFormContext } from 'react-hook-form';

export default function AccountStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const watchAccountType = watch('accountType');
  return (
    <Stack spacing={3}>
      <TextField
        {...register('accountName', { 
          required: 'Account name is required'
        })}
        label="Account Name"
        fullWidth
        autoComplete="organization"
        error={!!(errors.accountName)}
        helperText={errors.accountName ? (errors.accountName?.message as string) : ''}
      />
      <TextField
        {...register('accountDescription')}
        label="Description (Optional)"
        fullWidth
        multiline 
        rows={2}
        autoComplete="off"
        error={!!(errors.accountDescription)}
        helperText={errors.accountDescription ? (errors.accountDescription?.message as string) : ''}
      />
      <FormControl fullWidth error={!!(errors.accountType)}>
        <InputLabel>Account Type</InputLabel>
        <Select
          {...register('accountType', { required: 'Account type is required' })}
          label="Account Type"
          value={watchAccountType || ''}
          onChange={(e) => {
            setValue('accountType', e.target.value as AccountType, {
              shouldValidate: true,
              shouldDirty: true
            });
          }}
        >
          <MenuItem value="ORGANIZATION">Organization</MenuItem>
          <MenuItem value="INDIVIDUAL">Individual</MenuItem>
        </Select>
        {errors.accountType && (
          <Typography variant="caption" color="error" textAlign="left" sx={{ ml: 1, mt: 0.5 }}>
            {errors.accountType?.message as string}
          </Typography>
        )}
      </FormControl>
    </Stack>
  );
}
