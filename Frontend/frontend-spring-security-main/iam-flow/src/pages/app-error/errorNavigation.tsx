import { useNavigate } from 'react-router';
import type { ErrorType } from './AppError';

// Hook to navigate to error page with specific error types
export function useErrorNavigation() {
  const navigate = useNavigate();

  const navigateToError = (
    errorType: ErrorType = 'generic',
    title?: string,
    message?: string,
    options?: {
      redirect?: boolean;
      replace?: boolean;
    }
  ) => {
    const params = new URLSearchParams();
    
    if (errorType !== 'generic') {
      params.append('type', errorType);
    }
    
    if (title) {
      params.append('title', title);
    }
    
    if (message) {
      params.append('message', message);
    }
    
    if (options?.redirect) {
      params.append('redirect', 'true');
    }

    const url = `/error${params.toString() ? `?${params.toString()}` : ''}`;
    
    navigate(url, { replace: options?.replace });
  };

  return {
    navigateToError,
    navigateTo404: (message?: string) => navigateToError('404', undefined, message),
    navigateTo500: (message?: string) => navigateToError('500', undefined, message),
    navigateToNetwork: (message?: string) => navigateToError('network', undefined, message),
    navigateToAuth: (message?: string) => navigateToError('auth', undefined, message),
    navigateToForbidden: (message?: string) => navigateToError('forbidden', undefined, message),
    navigateToTimeout: (message?: string) => navigateToError('timeout', undefined, message),
    navigateToBlank: (message?: string) => navigateToError('blank', undefined, message),
  };
}

// Utility functions for common error scenarios
export const ErrorNavigationUtils = {
  // Create error URL with parameters
  createErrorUrl: (
    errorType: ErrorType = 'generic',
    title?: string,
    message?: string,
    redirect?: boolean
  ): string => {
    const params = new URLSearchParams();
    
    if (errorType !== 'generic') {
      params.append('type', errorType);
    }
    
    if (title) {
      params.append('title', title);
    }
    
    if (message) {
      params.append('message', message);
    }
    
    if (redirect) {
      params.append('redirect', 'true');
    }

    return `/error${params.toString() ? `?${params.toString()}` : ''}`;
  },

  // Handle common API errors and navigate to appropriate error page
  handleApiError: (error: unknown, navigate: ReturnType<typeof useNavigate>) => {
    // Type guard for axios-like error structure
    const isAxiosError = (err: unknown): err is { response?: { status: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    // Type guard for Error objects
    const isError = (err: unknown): err is Error => {
      return err instanceof Error;
    };

    if (!isAxiosError(error) || !error.response) {
      // Network error
      navigate(ErrorNavigationUtils.createErrorUrl('network', 'Connection Failed', 'Unable to reach the server. Please check your internet connection.'));
      return;
    }

    const status = error.response.status;
    
    switch (status) {
      case 401:
        navigate(ErrorNavigationUtils.createErrorUrl('auth', 'Authentication Required', 'Your session has expired. Please log in again.'));
        break;
      case 403:
        navigate(ErrorNavigationUtils.createErrorUrl('forbidden', 'Access Denied', 'You don\'t have permission to access this resource.'));
        break;
      case 404:
        navigate(ErrorNavigationUtils.createErrorUrl('404', 'Resource Not Found', 'The requested resource could not be found.'));
        break;
      case 408:
        navigate(ErrorNavigationUtils.createErrorUrl('timeout', 'Request Timeout', 'The request took too long to complete.'));
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        navigate(ErrorNavigationUtils.createErrorUrl('500', 'Server Error', 'Something went wrong on our servers. Please try again later.'));
        break;
      default: {
        const errorMessage = isError(error) ? error.message : 'An unexpected error occurred.';
        navigate(ErrorNavigationUtils.createErrorUrl('generic', 'Unexpected Error', errorMessage));
        break;
      }
    }
  }
};
