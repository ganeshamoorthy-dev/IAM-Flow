import { Component, type ErrorInfo, type ReactNode } from 'react';
import AppError from './AppError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const errorMessage = this.state.error?.message || 'An unexpected error occurred';
      const errorName = this.state.error?.name || 'Error';
      
      return (
        <AppError
          errorType="generic"
          customTitle={`${errorName}: Application Error`}
          customMessage={`${errorMessage}${process.env.NODE_ENV === 'development' ? 
            `\n\nStack trace: ${this.state.error?.stack}` : 
            ' Please refresh the page and try again.'}`}
          onRetry={this.handleRetry}
          showBackButton={false}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
