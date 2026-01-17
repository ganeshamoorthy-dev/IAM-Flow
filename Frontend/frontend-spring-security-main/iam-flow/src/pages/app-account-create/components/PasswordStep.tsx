import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormContext } from 'react-hook-form';
import { PasswordField } from '../../../components';

export default function PasswordStep() {

  const { watch } = useFormContext();
  
  const passwordValidation = {
    required: 'Password is required',
    minLength: {
      value: 8, 
      message: 'Password must be at least 8 characters' 
    },
    validate: {
      hasLowercase: (value: string) => 
        /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
      hasUppercase: (value: string) => 
        /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
      hasNumber: (value: string) => 
        /\d/.test(value) || 'Password must contain at least one number',
      hasSymbol: (value: string) => 
        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character'
    }
  };

  const confirmPasswordValidation = {
    required: 'Please confirm your password',
    validate: (value: string) => {
      const password = watch('password');
      return value === password || 'Passwords do not match';
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create a strong password with at least 8 characters including uppercase, lowercase, numbers, and special characters.
      </Typography>
      
      <PasswordField
        name="password"
        label="Password"
        validation={passwordValidation}
        showStrength={true}
      />
      
      <PasswordField
        name="confirmPassword"
        label="Confirm Password"
        validation={confirmPasswordValidation}
      />
    </Stack>
  );
}
