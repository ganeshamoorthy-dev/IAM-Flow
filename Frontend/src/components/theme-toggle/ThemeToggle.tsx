import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'default' | 'onTransparent' | 'onPaper';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'default' }) => {
  const { mode, toggleTheme } = useTheme();

  const getButtonStyles = () => {
    switch (variant) {
      case 'onTransparent':
        return {
          color: 'white',
          border: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.5)'
          }
        };
      case 'onPaper':
        return {
          color: 'text.primary',
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'text.secondary'
          }
        };
      default:
        return {
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover'
          }
        };
    }
  };

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          ...getButtonStyles(),
          transition: 'all 0.2s ease'
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};
