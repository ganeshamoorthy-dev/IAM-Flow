import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Divider from '@mui/material/Divider';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoginIcon from '@mui/icons-material/Login';
import BusinessIcon from '@mui/icons-material/Business';
import { authService, accountService } from '../../services';
import { PasswordField } from '../../components';
import type { OtpValidationRequest } from '../../models/request/OtpValidationRequest';
import type { SetPasswordRequest } from '../../models/request/SetPasswordRequest';
import type { AccountGetResponse } from '../../models/response/AccountGetResponse';
import type { ResendOtpRequest } from '../../models/request/ResendOtpRequest';

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

export default function AppOtpPasswordSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract OTP from query params
  const otpParam = searchParams.get('otp');
  const emailParam = searchParams.get('email');
  const accountIdParam = searchParams.get('accountId');

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpValidationStatus, setOtpValidationStatus] = useState<'validating' | 'valid' | 'invalid' | 'expired'>('validating');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountGetResponse | null>(null);

  // Form setup
  const formMethods = useForm<PasswordForm>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const { handleSubmit, watch } = formMethods;
  const password = watch('password');

  // Validate OTP on component mount
  useEffect(() => {
    const validateOtp = async () => {
      if (!otpParam || !emailParam || !accountIdParam) {
        setOtpValidationStatus('invalid');
        setError('Invalid or missing parameters. Please check your email link.');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const request: OtpValidationRequest = {
          email: emailParam,
          otp: parseInt(otpParam),
          accountId: parseInt(accountIdParam)
        };

        const response = await authService.validateOtp(request);

        if (response.status === 'VALID') {
          setOtpValidationStatus('valid');
          setCurrentStep(1);
          setSuccess('OTP validated successfully! Now please set your password.');

          // Load account information after successful OTP validation
          try {
            const accountData = await accountService.getAccount(parseInt(accountIdParam));
            setAccountInfo(accountData);
          } catch (accountError) {
            console.error('Failed to load account info:', accountError);
            // Don't block the flow if account info fails to load
          }
        } else if (response.status === 'EXPIRED') {
          setOtpValidationStatus('expired');
          setError('Your OTP has expired. Please request a new one.');
        } else {
          setOtpValidationStatus('invalid');
          setError('Invalid OTP. Please check your email and try again.');
        }
      } catch (error) {
        console.error('OTP validation failed:', error);
        setOtpValidationStatus('invalid');
        setError('Failed to validate OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    validateOtp();
  }, [otpParam, emailParam, accountIdParam]);

  const onPasswordSubmit: SubmitHandler<PasswordForm> = async (data) => {
    if (!emailParam || !accountIdParam) {
      setError('Missing account information');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: SetPasswordRequest = {
        email: emailParam,
        password: data.password
      };

      await authService.setPassword(parseInt(accountIdParam), request);
      setSuccess(`Password set successfully! Redirecting to login page... Remember to use Account ID: ${accountIdParam}`);

      // Redirect to login page after successful password setup
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Increased to 3 seconds to give user time to read the account ID
    } catch (error) {
      console.error('Password setting failed:', error);
      setError('Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailParam) return;

    try {
      setLoading(true);
      setError(null);

      const reqBody: ResendOtpRequest = {
        email: emailParam,
        accountId: parseInt(accountIdParam ?? '0'),
        isRoot: false
      };

      await authService.resendOtp(reqBody);
      setSuccess('A new OTP has been sent to your email. Please check and use the new link.');
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError('Failed to resend OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Validate OTP',
    'Set Password'
  ];

  // If OTP is expired, show only the expired message and resend option
  if (otpValidationStatus === 'expired') {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 64, color: 'warning.main', mb: 3 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="warning.main">
              Link Expired
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Your verification link has expired. Please request a new one to continue with your account setup.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                onClick={handleResendOtp}
                disabled={loading || !emailParam}
                size="large"
                fullWidth
              >
                {loading ? 'Sending...' : 'Resend Verification Link'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                size="large"
                fullWidth
              >
                Back to Login
              </Button>
            </Stack>

            {emailParam && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
                New link will be sent to: {emailParam}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Complete Account Setup
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Verify your OTP and set up your password to access your account
            </Typography>
          </Box>

          {/* Account Information Card */}
          {accountInfo && (
            <Alert
              severity="info"
              icon={<BusinessIcon />}
              sx={{
                mb: 4,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Account Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {accountInfo.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account ID (needed for login)
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{
                        bgcolor: 'background.paper',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'inline-block'
                      }}
                    >
                      {accountIdParam}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  💡 Please save your Account ID - you'll need it to log in to this account
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Progress Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {completed ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : index + 1}
                      </Box>
                    )}
                  >
                    <Typography variant="body1" fontWeight={currentStep === index ? 'bold' : 'normal'}>
                      {label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ pl: 3, pb: 2 }}>
                      {/* Step 0: OTP Validation */}
                      {index === 0 && (
                        <Box>
                          {otpValidationStatus === 'validating' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CircularProgress size={20} />
                              <Typography variant="body2" color="text.secondary">
                                Validating your OTP...
                              </Typography>
                            </Box>
                          )}

                          {otpValidationStatus === 'valid' && (
                            <Alert severity="success" icon={<CheckCircleIcon />}>
                              OTP validated successfully! You can now proceed to set your password.
                            </Alert>
                          )}



                          {otpValidationStatus === 'invalid' && (
                            <Box>
                              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                                Invalid OTP or missing parameters. Please check your email link.
                              </Alert>
                              <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleResendOtp}
                                disabled={loading || !emailParam}
                                size="small"
                              >
                                Resend OTP
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Step 1: Password Setting */}
                      {index === 1 && currentStep >= 1 && (
                        <FormProvider {...formMethods}>
                          <Box component="form" onSubmit={handleSubmit(onPasswordSubmit)}>
                            <Stack spacing={3}>
                              <PasswordField
                                name="password"
                                label="New Password"
                                showStrength={true}
                                validation={{
                                  required: 'Password is required',
                                  minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                  },
                                  pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
                                    message: 'Password must contain uppercase, lowercase, number and special character'
                                  }
                                }}
                              />

                              <PasswordField
                                name="confirmPassword"
                                label="Confirm Password"
                                validation={{
                                  required: 'Please confirm your password',
                                  validate: (value: string) =>
                                    value === password || 'Passwords do not match'
                                }}
                              />

                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                startIcon={<LockIcon />}
                                disabled={loading}
                                size="large"
                              >
                                {loading ? <CircularProgress size={20} /> : 'Set Password & Continue to Login'}
                              </Button>
                            </Stack>
                          </Box>
                        </FormProvider>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Status Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Help Text */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact your administrator or check your email for the correct link.
            </Typography>
            {currentStep === 1 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="text"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate('/login')}
                  size="small"
                >
                  Already have a password? Go to Login
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
