import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { ThemeToggle } from '../../components';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import LockIcon from '@mui/icons-material/Lock';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export type ErrorType = 
  | '404' 
  | '500' 
  | 'network' 
  | 'auth' 
  | 'forbidden' 
  | 'timeout' 
  | 'generic'
  | 'blank';

interface ErrorConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: 'error' | 'warning' | 'info';
  actions: Array<{
    label: string;
    action: () => void;
    variant: 'contained' | 'outlined' | 'text';
    startIcon?: React.ReactNode;
  }>;
}

interface AppErrorProps {
  errorType?: ErrorType;
  customTitle?: string;
  customMessage?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function AppError({
  errorType = 'generic',
  customTitle,
  customMessage,
  onRetry,
  showBackButton = true,
  showHomeButton = true
}: AppErrorProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // Get error details from URL params if available
  const urlErrorType = searchParams.get('type') as ErrorType | null;
  const urlMessage = searchParams.get('message');
  const urlTitle = searchParams.get('title');
  const autoRedirect = searchParams.get('redirect');

  const finalErrorType = urlErrorType || errorType;
  const finalTitle = urlTitle || customTitle;
  const finalMessage = urlMessage || customMessage;

  // Auto-redirect countdown for certain error types
  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      navigate('/');
    }
  }, [countdown, autoRedirect, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleRefresh();
    }
  };

  const getErrorConfig = (type: ErrorType): ErrorConfig => {
    const baseActions = [
      ...(onRetry ? [{
        label: 'Try Again',
        action: handleRetry,
        variant: 'contained' as const,
        startIcon: <RefreshIcon />
      }] : []),
      ...(showBackButton ? [{
        label: 'Go Back',
        action: handleGoBack,
        variant: 'outlined' as const,
        startIcon: <ArrowBackIcon />
      }] : []),
      ...(showHomeButton ? [{
        label: 'Go Home',
        action: handleGoHome,
        variant: 'text' as const,
        startIcon: <HomeIcon />
      }] : [])
    ];

    switch (type) {
      case '404':
        return {
          icon: <SearchOffIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
          title: finalTitle || 'Page Not Found',
          message: finalMessage || 'The page you are looking for doesn\'t exist or has been moved.',
          color: 'warning',
          actions: [
            {
              label: 'Go Home',
              action: handleGoHome,
              variant: 'contained',
              startIcon: <HomeIcon />
            },
            ...(showBackButton ? [{
              label: 'Go Back',
              action: handleGoBack,
              variant: 'outlined' as const,
              startIcon: <ArrowBackIcon />
            }] : [])
          ]
        };

      case '500':
        return {
          icon: <BugReportIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: finalTitle || 'Server Error',
          message: finalMessage || 'Something went wrong on our servers. Our team has been notified and is working on a fix.',
          color: 'error',
          actions: [
            {
              label: 'Refresh Page',
              action: handleRefresh,
              variant: 'contained',
              startIcon: <RefreshIcon />
            },
            ...baseActions.slice(1)
          ]
        };

      case 'network':
        return {
          icon: <WifiOffIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: finalTitle || 'Connection Problem',
          message: finalMessage || 'Unable to connect to our servers. Please check your internet connection and try again.',
          color: 'error',
          actions: [
            {
              label: 'Try Again',
              action: handleRetry,
              variant: 'contained',
              startIcon: <RefreshIcon />
            },
            ...baseActions.slice(1)
          ]
        };

      case 'auth':
        return {
          icon: <LockIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
          title: finalTitle || 'Authentication Required',
          message: finalMessage || 'Your session has expired. Please log in again to continue.',
          color: 'warning',
          actions: [
            {
              label: 'Sign In',
              action: () => navigate('/login'),
              variant: 'contained',
              startIcon: <LockIcon />
            },
            {
              label: 'Go Home',
              action: handleGoHome,
              variant: 'outlined',
              startIcon: <HomeIcon />
            }
          ]
        };

      case 'forbidden':
        return {
          icon: <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: finalTitle || 'Access Denied',
          message: finalMessage || 'You don\'t have permission to access this resource. Contact your administrator if you believe this is an error.',
          color: 'error',
          actions: baseActions
        };

      case 'timeout':
        return {
          icon: <RefreshIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
          title: finalTitle || 'Request Timeout',
          message: finalMessage || 'The request took too long to complete. Please try again.',
          color: 'warning',
          actions: [
            {
              label: 'Try Again',
              action: handleRetry,
              variant: 'contained',
              startIcon: <RefreshIcon />
            },
            ...baseActions.slice(1)
          ]
        };

      case 'blank':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: 'info.main' }} />,
          title: finalTitle || 'Nothing to Show',
          message: finalMessage || 'This page appears to be empty or the content failed to load properly.',
          color: 'info',
          actions: [
            {
              label: 'Refresh',
              action: handleRefresh,
              variant: 'contained',
              startIcon: <RefreshIcon />
            },
            ...baseActions.slice(1)
          ]
        };

      default:
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: finalTitle || 'Something Went Wrong',
          message: finalMessage || 'An unexpected error occurred. Please try again or contact support if the problem persists.',
          color: 'error',
          actions: baseActions
        };
    }
  };

  const errorConfig = getErrorConfig(finalErrorType);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: (theme) => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1000
      }}>
        <ThemeToggle />
      </Box>

      <Card sx={{
        maxWidth: 600,
        width: '100%',
        boxShadow: 8,
        borderRadius: 3,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          {/* Error Icon */}
          <Box sx={{ mb: 3 }}>
            {errorConfig.icon}
          </Box>

          {/* Error Title */}
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            color={`${errorConfig.color}.main`}
            sx={{ mb: 2 }}
          >
            {errorConfig.title}
          </Typography>

          {/* Error Message */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4, lineHeight: 1.6, maxWidth: 500, mx: 'auto' }}
          >
            {errorConfig.message}
          </Typography>

          {/* Auto-redirect countdown */}
          {autoRedirect && countdown > 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Redirecting to home page in {countdown} seconds...
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack 
            spacing={2} 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            {errorConfig.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                startIcon={action.startIcon}
                size="large"
                sx={{ minWidth: 140 }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>

          {/* Additional Help */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Need help?
            </Typography>
          </Divider>

          <Stack spacing={1} alignItems="center">
            <Button
              variant="text"
              startIcon={<SupportAgentIcon />}
              size="small"
              color="primary"
              onClick={() => {
                // You can implement contact support functionality here
                console.log('Contact support clicked');
              }}
            >
              Contact Support
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 400 }}>
              If this problem persists, please report it to our support team with the error details.
            </Typography>
          </Stack>

          {/* Error Details for Development */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" component="div">
                <strong>Debug Info:</strong><br />
                Error Type: {finalErrorType}<br />
                URL: {window.location.href}<br />
                User Agent: {navigator.userAgent.substring(0, 50)}...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography 
        variant="caption" 
        color="rgba(255,255,255,0.7)" 
        sx={{ mt: 3, textAlign: 'center' }}
      >
        © 2025 IAM Flow. All rights reserved.
      </Typography>
    </Box>
  );
}
