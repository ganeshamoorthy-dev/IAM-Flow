import { useState } from 'react';
import { useNavigate } from 'react-router';
import LoginPage from './AppLogin';
import type { LoginForm } from '../../models/form/LoginForm';
import { authService } from '../../services';

export default function AppLoginContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (loginData: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const loginPromise = loginData.loginType === 'root' 
        ? authService.rootLogin({
            email: loginData.email,
            password: loginData.password
          })
        : authService.login({
            email: loginData.email,
            password: loginData.password,
            accountId: parseInt(loginData.accountId!)
          });

      // Wait for both the API call and minimum loading time
      await Promise.all([loginPromise]);

      // Navigate to dashboard or appropriate page
      navigate('/app/dashboard');

    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('Invalid credentials') || err.message.includes('Unauthorized')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (err.message.includes('Account not found')) {
          errorMessage = 'Account ID not found. Please verify your account identifier.';
        } else if (err.message.includes('Account ID is required')) {
          errorMessage = 'Account ID is required for user login.';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}
