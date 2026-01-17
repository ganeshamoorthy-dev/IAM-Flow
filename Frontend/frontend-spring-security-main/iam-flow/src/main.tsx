
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import AppRoutes from './router/AppRoutes';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { ErrorBoundary, logErrorToService } from './pages/app-error';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary onError={logErrorToService}>
      <ThemeContextProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeContextProvider>
    </ErrorBoundary>
  </StrictMode>
);
