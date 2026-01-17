import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { AppHeader } from '../../components/app-header/AppHeader';
import AppNavigationSidebar from '../../components/app-navigation-sidebar/AppNavigationSidebar';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import { CurrentUserContextProvider } from '../../contexts/CurrentUserContext';
import { ErrorBoundary } from '../app-error';

const AppBaseContainer = styled.div<{ isDarkMode: boolean; }>`
  .app-content {
    margin-top: 64px;
    height: calc(100vh - 64px);
    width: calc(100%);
    background-color: ${props => props.isDarkMode ? '#121212' : '#ffffff'};
    transition: background-color 0.3s ease;
  }
`;

export default function AppBase() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <CurrentUserContextProvider>
    <AppBaseContainer isDarkMode={isDarkMode}>
      <AppHeader />
      <Box style={{ display: 'flex' }}>
        <AppNavigationSidebar />
        <Box className="app-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </AppBaseContainer>
    </CurrentUserContextProvider>
  );
}
