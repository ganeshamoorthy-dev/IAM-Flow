import { useState } from 'react';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormContext } from 'react-hook-form';

// Password strength checker
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: 'error' },
    { score: 2, label: 'Weak', color: 'warning' },
    { score: 3, label: 'Fair', color: 'info' },
    { score: 4, label: 'Good', color: 'success' },
    { score: 5, label: 'Strong', color: 'success' }
  ];
  
  return levels[score];
};

export interface PasswordFieldProps {
  name: string;
  label: string;
  validation?: object;
  showStrength?: boolean;
}

export default function PasswordField({ 
  name,
  label,
  validation,
  showStrength = false
}: PasswordFieldProps) {
  const { register, formState: { errors, touchedFields, dirtyFields }, watch } = useFormContext();
  const [show, setShow] = useState(false);
  
  const fieldError = errors[name];
  const fieldTouched = touchedFields[name];
  const fieldDirty = dirtyFields[name];
  const shouldShowError = fieldError && fieldTouched && fieldDirty;
  const passwordValue = watch(name);
  const strength = showStrength ? getPasswordStrength(passwordValue) : null;

  return (
    <Box>
      <TextField
        {...register(name, validation)}
        autoComplete="new-password"
        label={label}
        type={show ? 'text' : 'password'}
        fullWidth
        error={!!shouldShowError}
        helperText={shouldShowError ? (fieldError?.message as string) : ''}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={`toggle ${label.toLowerCase()} visibility`}
                  onClick={() => setShow(!show)}
                  edge="end"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
      />
      {showStrength && passwordValue && strength && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(strength.score / 5) * 100}
            color={strength.color as 'error' | 'warning' | 'info' | 'success'}
            sx={{ height: 6, borderRadius: 1 }}
          />
          <Typography variant="caption" color={`${strength.color}.main`} sx={{ mt: 0.5, display: 'block' }}>
            Password strength: {strength.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
