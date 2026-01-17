import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CheckCircle, AccountCircle, Person, VerifiedUser, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { AccountCreateForm } from '../../models/form/AccountCreateForm';
import { AccountStep, PersonalStep, OTPStep, PasswordStep, FormProvider } from './components';
import { ThemeToggle } from '../../components/theme-toggle/ThemeToggle';
import { accountService, authService, userService, type AccountCreateRequest, type OtpValidationRequest, type SetPasswordRequest } from '../../services';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import type { AccountCreateResponse } from '../../models/response/AccountCreateResponse';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../models/common/ErrorResponse';

// Steps configuration
interface StepConfigModel {
  id: string;
  label: string;
  description: string;
  icon: ReactElement;
  fields: (keyof AccountCreateForm)[];
}

const stepsConfig: StepConfigModel[] = [
  {
    id: "account",
    label: 'Account Info',
    description: 'Set up your account details',
    icon: <AccountCircle />,
    fields: ['accountName', 'accountType'] as (keyof AccountCreateForm)[]
  },
  {
    id: "personal",
    label: 'Personal Info',
    description: 'Tell us about yourself',
    icon: <Person />,
    fields: ['firstName', 'lastName', 'email'] as (keyof AccountCreateForm)[]
  },
  {
    id: "otp",
    label: 'Verification',
    description: 'Verify your email address',
    icon: <VerifiedUser />,
    fields: ['otp'] as (keyof AccountCreateForm)[]
  },
  {
    id: "password",
    label: 'Security',
    description: 'Create a secure password',
    icon: <Lock />,
    fields: ['password', 'confirmPassword'] as (keyof AccountCreateForm)[]
  }
];

export default function AppAccountCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [account, setAccount] = useState<AccountCreateResponse>();

  const formMethods = useForm<AccountCreateForm>({
    mode: 'onTouched'
  });

  const { handleSubmit, trigger, getValues } = formMethods;

  const getStepFields = (step: number): (keyof AccountCreateForm)[] => {
    return stepsConfig[step]?.fields || [];
  };

  const handleNext = async () => {
    const fieldsToValidate = getStepFields(activeStep);
    const isStepValid = await trigger(fieldsToValidate);

    if (!isStepValid) return;
    if (activeStep == 1) {
      createAccount();
    } else if (activeStep == 2) {
      validateOtp();
    } else {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
    }

  };

  const createAccount = async () => {
    try {
      const reqBody = preparePayloadForAccountCreate();
      setLoading(true);
      const response = await accountService.createAccount(reqBody);
      setAccount(response);
      toast.success("Account creation successfully done. Otp has been sent to verify email");
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setLoading(false);
    } catch (exception) {
      setLoading(false);
      toast.error("Failed to create an account.");
      console.log(exception);
    }
  };

  function preparePayloadForAccountCreate(): AccountCreateRequest {
    const formValue = getValues();
    return {
      name: formValue.accountName,
      description: formValue.accountDescription,
      type: formValue.accountType,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      middleName: formValue.middleName,
      userDescription: formValue.personalDescription
    };
  }

  const validateOtp = async () => {
    try {
      const reqBody: OtpValidationRequest = preparePayloadForOtpValidation();
      setLoading(true);
      const response = await authService.validateOtp(reqBody);
      if (response.status == "VALID") {
        toast.success("Otp Verification success");
        setLoading(false);
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
      } else {
        toast.error("Otp Verification status is" + response.status);
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const errorResponse = error.response?.data as ErrorResponse;
        toast.error("Otp Verification failed" + errorResponse?.message);
      }
      setLoading(false);
    }
  };

  function preparePayloadForOtpValidation(): OtpValidationRequest {
    const formValue = getValues();
    return {
      email: formValue.email,
      otp: parseInt(formValue.otp),
      accountId: account?.id ?? 0
    };
  }


  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish: SubmitHandler<AccountCreateForm> = async (data) => {

    try {
      const reqBody: SetPasswordRequest = { email: data.email, password: data.password };
      setLoading(true);

      await userService.setPassword(account?.id ?? 0, reqBody);
      toast.success("Password has been set.");
      setLoading(false);
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("Unable to set the password");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const currentStep = stepsConfig[activeStep];

    if (!currentStep) return null;

    // Render specific components with their required props
    switch (currentStep.id) {
      case 'account':
        return <AccountStep />;
      case 'personal':
        return <PersonalStep />;
      case 'otp':
        return <OTPStep accountData={account} />;
      case 'password':
        return <PasswordStep />;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Create Account
          </Typography>
          <ThemeToggle variant="onPaper" />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          pt: 8 // Account for fixed toolbar
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Paper
            elevation={8}
            sx={{
              minHeight: 'calc(100vh - 120px)',
              borderRadius: 3,
              background: 'background.paper',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            {/* Left Panel - Progress & Steps */}
            <Box
              sx={{
                width: { xs: '100%', md: '400px' },
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Header */}
              <Box>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                  Join our secure platform in just a few easy steps
                </Typography>

                {/* Progress */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label={`Step ${activeStep + 1} of ${stepsConfig.length}`}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      ({Math.round(((activeStep + 1) / stepsConfig.length) * 100)}% Complete)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / stepsConfig.length) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Box>

                {/* Steps List */}
                <Stack spacing={3}>
                  {stepsConfig.map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        opacity: index <= activeStep ? 1 : 0.5,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index < activeStep
                            ? 'rgba(255,255,255,0.9)'
                            : index === activeStep
                              ? 'white'
                              : 'rgba(255,255,255,0.2)',
                          color: index <= activeStep ? 'primary.main' : 'white',
                          transition: 'all 0.3s ease',
                          flexShrink: 0
                        }}
                      >
                        {index < activeStep ? (
                          <CheckCircle sx={{ fontSize: 24 }} />
                        ) : (
                          <Box sx={{ fontSize: 24, display: 'flex', alignItems: 'center' }}>
                            {step.icon}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {step.label}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', opacity: 0.7 }}>
                <Typography variant="body2">
                  Secure • Fast • Reliable
                </Typography>
              </Box>
            </Box>

            {/* Right Panel - Form Content */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Form Header */}
              <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ fontSize: 32, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    {stepsConfig[activeStep].icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="medium">
                      {stepsConfig[activeStep].label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stepsConfig[activeStep].description}
                    </Typography>
                  </Box>
                </Box>
                {loading && <LinearProgress></LinearProgress>}
              </Box>

              {/* Form Content */}
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(handleFinish)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ maxWidth: 500, width: '100%' }}>
                      {renderStepContent()}
                    </Box>
                  </Box>

                  {/* Navigation Footer */}
                  <Box sx={{
                    p: 4,
                    borderTop: '1px solid',
                    borderColor: 'grey.200',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {(activeStep == 1) ?
                      <Button
                        color="inherit"
                        onClick={handleBack}
                        sx={{ px: 3 }}
                      >
                        Back
                      </Button> :
                      <>
                        <Button
                          color="inherit"
                          onClick={() => navigate("/")}
                          sx={{ px: 3 }}
                        >
                          Cancel
                        </Button>
                      </>
                    }


                    <Stack direction="row" spacing={1}>
                      {stepsConfig.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: index <= activeStep ? 'primary.main' : 'grey.300',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </Stack>

                    {activeStep === stepsConfig.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ px: 4 }}
                      >
                        Create Account
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        size="large"
                        sx={{ px: 3 }}
                      >
                        Continue
                      </Button>
                    )}
                  </Box>
                </form>
              </FormProvider>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

