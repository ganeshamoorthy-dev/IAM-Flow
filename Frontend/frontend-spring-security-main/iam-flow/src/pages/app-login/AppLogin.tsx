import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Paper,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  AdminPanelSettings,
  Email,
  Lock,
  Business,
  ArrowBack
} from '@mui/icons-material';
import { Link } from 'react-router';
import type { LoginForm } from '../../models/form/LoginForm';
import { ThemeToggle } from '../../components/theme-toggle/ThemeToggle';

interface LoginPageProps {
  onLogin?: (loginData: LoginForm) => void;
  loading?: boolean;
  error?: string;
}

export default function LoginPage({ onLogin, loading = false, error }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'root'>('user');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      accountId: '',
      loginType: 'user'
    },
    mode: 'onChange'
  });

  const handleLoginTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLoginType: 'user' | 'root' | null
  ) => {
    if (newLoginType !== null) {
      setLoginType(newLoginType);
      reset({
        email: '',
        password: '',
        accountId: newLoginType === 'user' ? '' : undefined,
        loginType: newLoginType
      });
    }
  };

  const onSubmit = (data: LoginForm) => {
    const loginData = {
      ...data,
      loginType
    };
    onLogin?.(loginData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Toolbar with theme toggle and back button */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            component={Link}
            to="/" 
            disabled={loading}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Sign In
          </Typography>
          <ThemeToggle variant="onPaper" />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          pt: 10 // Account for fixed toolbar
        }}
      >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 550,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #263238 30%, #37474f 90%)'
              : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            padding: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Sign in to your account to continue
          </Typography>
        </Box>

                <CardContent sx={{ 
          p: 4,
          position: 'relative',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
              Select your login type
            </Typography>
            <ToggleButtonGroup
              value={loginType}
              exclusive
              onChange={handleLoginTypeChange}
              disabled={loading}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton 
                value="user" 
                sx={{ 
                  flex: 1, 
                  py: 2,
                  flexDirection: 'column',
                  gap: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountCircle fontSize="small" />
                  <Typography variant="body2" fontWeight="medium">User login</Typography>
                </Stack>
                <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.8, fontSize: '0.65rem', lineHeight: 1.2 }}>
                  User within an account that performs daily tasks
                </Typography>
              </ToggleButton>
              <ToggleButton 
                value="root"
                sx={{ 
                  flex: 1, 
                  py: 2,
                  flexDirection: 'column',
                  gap: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'secondary.dark'
                    }
                  }
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <AdminPanelSettings fontSize="small" />
                  <Typography variant="body2" fontWeight="medium">Root login</Typography>
                </Stack>
                <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.8, fontSize: '0.65rem', lineHeight: 1.2 }}>
                  Account owner that performs tasks requiring unrestricted access
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {loginType === 'user' && (
                <Controller
                  name="accountId"
                  control={control}
                  rules={{
                    required: loginType === 'user' ? 'Account ID is required for user login' : false,
                    pattern: {
                      value: /^[a-zA-Z0-9-_]+$/,
                      message: 'Account ID can only contain letters, numbers, hyphens, and underscores'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Account ID"
                      autoComplete='false'
                      placeholder="Enter your account identifier"
                      disabled={loading}
                      error={!!errors.accountId}
                      helperText={errors.accountId?.message}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete='false'
                    disabled={loading}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    autoComplete='false'
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={loading}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !isValid}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  py: 1.5,
                  mt: 2,
                  background: loginType === 'user' 
                    ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                    : 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: loginType === 'user'
                      ? 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)'
                      : 'linear-gradient(45deg, #E55555 30%, #E77A43 90%)',
                  },
                  '&:disabled': {
                    background: loading 
                      ? (loginType === 'user' 
                        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                        : 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)')
                      : 'rgba(0, 0, 0, 0.12)',
                    opacity: loading ? 0.8 : 0.6,
                  }
                }}
              >
                {loading ? 'Signing in...' : `Sign in as ${loginType === 'user' ? 'user' : 'root'}`}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Need help?
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="text" 
              size="small" 
              disabled={loading}
              sx={{ mr: 2 }}
            >
              Forgot Password?
            </Button>
            <Button 
              variant="text" 
              size="small"
              disabled={loading}
            >
              Contact Support
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Box>
    </>
  );
}
