import { Box, Button, Container, Typography, Card, CardContent, Stack, Chip, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router';
import {
  Security,
  AccountCircle,
  People,
  AdminPanelSettings,
  Shield,
  Key,
  VerifiedUser,
  Dashboard,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import { ThemeToggle } from '../../components/theme-toggle/ThemeToggle';

const features = [
  {
    icon: <AccountCircle sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Account Management',
    description: 'Create and manage user accounts with comprehensive profile management and secure authentication.'
  },
  {
    icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'User Administration',
    description: 'Efficiently manage users across your organization with role-based access controls.'
  },
  {
    icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Role-Based Access',
    description: 'Define and assign roles with granular permissions to ensure proper access control.'
  },
  {
    icon: <Shield sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Security First',
    description: 'Built with enterprise-grade security features and compliance standards in mind.'
  },
  {
    icon: <Key sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Authentication',
    description: 'Secure login flows with support for both regular users and administrative access.'
  },
  {
    icon: <Dashboard sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Analytics Dashboard',
    description: 'Monitor user activities and access patterns with comprehensive reporting tools.'
  }
];

const benefits = [
  'Streamlined user onboarding process',
  'Centralized identity management',
  'Enhanced security and compliance',
  'Scalable role-based permissions',
  'Real-time monitoring and analytics',
  'Intuitive administrative interface'
];

export default function LandingPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      overflow: 'visible'
    }}>
      {/* Header with theme toggle */}
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(38, 50, 56, 0.9)' 
            : 'rgba(0, 0, 0, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderBottom: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
            IAM Flow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle variant="onTransparent" />
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '128px' // Account for fixed header
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Chip
                label="Identity & Access Management"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium'
                }}
              />
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Secure IAM Flow
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.4 }}>
                Comprehensive Identity and Access Management solution for modern organizations.
                Manage users, roles, and permissions with enterprise-grade security.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  to="/account-create"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: 'white',
                    color: (theme) => theme.palette.mode === 'dark' ? '#1565c0' : '#1976d2',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#f5f5f5',
                      color: (theme) => theme.palette.mode === 'dark' ? '#0d47a1' : '#1565c0'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <VerifiedUser sx={{ fontSize: 120, color: 'white', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Enterprise Security
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Trusted by organizations worldwide for secure identity management
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Powerful IAM Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to manage identities, access, and security in one comprehensive platform
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" color="text.primary">
                Why Choose Our IAM Solution?
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }} color="text.secondary">
                Our Identity and Access Management platform provides enterprise-grade security
                with an intuitive interface, making it easy to manage users, roles, and permissions
                across your organization.
              </Typography>
              <Stack spacing={2}>
                {benefits.map((benefit, index) => (
                  <Stack direction="row" spacing={2} key={index} alignItems="center">
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body1" color="text.primary">{benefit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  boxShadow: 2,
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
                  Administrative Control
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Complete control over user access with granular permission management
                </Typography>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  startIcon={<Key />}
                >
                  Admin Access
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #263238 30%, #37474f 90%)'
            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Box sx={{ mb: 4 }}>
            <VerifiedUser sx={{ fontSize: 80, mb: 2, opacity: 0.9, color: 'white' }} />
          </Box>
          
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 2, color: 'white' }}>
            Ready to Get Started?
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: 600, mx: 'auto', color: 'white' }}>
            Join thousands of organizations who trust our platform for secure, scalable identity management. 
            Start your journey today with enterprise-grade security.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Button
              component={Link}
              to="/account-create"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: (theme) => theme.palette.mode === 'dark' ? '#1565c0' : '#1976d2',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? '#f0f0f0' : '#f5f5f5',
                  color: (theme) => theme.palette.mode === 'dark' ? '#0d47a1' : '#1565c0',
                  transform: 'translateY(-2px)',
                  boxShadow: 6
                },
                transition: 'all 0.3s ease'
              }}
            >
              Create Free Account
            </Button>
            <Button
              component={Link}
              to="/login-demo"
              variant="outlined"
              size="large"
              startIcon={<Dashboard />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Try Demo
            </Button>
          </Stack>
          
          <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic', color: 'white' }}>
            No credit card required • Free 30-day trial • Setup in minutes
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
