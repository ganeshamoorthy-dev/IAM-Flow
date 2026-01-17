import React, { type ErrorInfo, type ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Hook-based error handler for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Manual error reported:', error, errorInfo);
    
    // In a real app, you might want to report this to an error service
    // logErrorToService(error, errorInfo);
    
    // For now, we'll throw the error to trigger the error boundary
    throw error;
  };
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Error logging utility
export function logErrorToService(error: Error, errorInfo?: ErrorInfo) {
  // In production, you would send this to your error monitoring service
  // Examples: Sentry, LogRocket, Rollbar, etc.
  console.group('🚨 Error Report');
  console.error('Error:', error);
  console.error('Error Info:', errorInfo);
  console.error('Stack:', error.stack);
  console.error('Timestamp:', new Date().toISOString());
  console.error('URL:', window.location.href);
  console.error('User Agent:', navigator.userAgent);
  console.groupEnd();
}
