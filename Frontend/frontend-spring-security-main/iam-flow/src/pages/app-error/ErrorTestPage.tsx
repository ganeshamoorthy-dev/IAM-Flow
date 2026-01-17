import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useErrorNavigation, useErrorHandler } from './index';

export default function ErrorTestPage() {
  const { 
    navigateTo404, 
    navigateTo500, 
    navigateToNetwork, 
    navigateToAuth, 
    navigateToForbidden, 
    navigateToTimeout,
    navigateToBlank,
    navigateToError 
  } = useErrorNavigation();
  
  const handleError = useErrorHandler();

  const throwJSError = () => {
    // This will be caught by the ErrorBoundary
    throw new Error('This is a test JavaScript error thrown from a component');
  };

  const throwAsyncError = async () => {
    try {
      // Simulate async error
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 100);
      });
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Error Handling Test Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use the buttons below to test different error scenarios and see how the error page handles them.
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Navigation-Based Errors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These errors navigate to the error page with specific error types.
          </Typography>
          
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
            <Button variant="outlined" onClick={() => navigateTo404()}>
              404 - Not Found
            </Button>
            <Button variant="outlined" onClick={() => navigateTo500()}>
              500 - Server Error
            </Button>
            <Button variant="outlined" onClick={() => navigateToNetwork()}>
              Network Error
            </Button>
            <Button variant="outlined" onClick={() => navigateToAuth()}>
              Auth Required
            </Button>
            <Button variant="outlined" onClick={() => navigateToForbidden()}>
              403 - Forbidden
            </Button>
            <Button variant="outlined" onClick={() => navigateToTimeout()}>
              Request Timeout
            </Button>
            <Button variant="outlined" onClick={() => navigateToBlank()}>
              Blank Page
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custom Error Messages
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Test error pages with custom titles and messages.
          </Typography>
          
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
            <Button 
              variant="outlined" 
              onClick={() => navigateToError('generic', 'Custom Error Title', 'This is a custom error message for testing purposes.')}
            >
              Custom Generic Error
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigateToError('404', 'Page Moved', 'This page has been moved to a new location.')}
            >
              Custom 404 Error
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigateToError('500', 'Database Down', 'Our database is temporarily unavailable. Please try again in a few minutes.')}
            >
              Custom Server Error
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            JavaScript Errors (Error Boundary)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These errors will be caught by the React Error Boundary component.
          </Typography>
          
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap">
            <Button 
              variant="contained" 
              color="error" 
              onClick={throwJSError}
            >
              Throw JS Error
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={throwAsyncError}
            >
              Throw Async Error
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        This test page is only available in development mode. The error handling system works in all environments.
      </Typography>
    </Box>
  );
}
