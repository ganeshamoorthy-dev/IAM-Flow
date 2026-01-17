import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Avatar,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import { Person } from '@mui/icons-material';

interface CurrentUserLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'minimal' | 'card' | 'fullscreen';
}

export const CurrentUserLoader: React.FC<CurrentUserLoaderProps> = ({
  message = 'Loading user profile...',
  size = 'medium',
  variant = 'card'
}) => {
  const theme = useTheme();

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { spinner: 30, avatar: 40, padding: 2 };
      case 'large':
        return { spinner: 50, avatar: 80, padding: 4 };
      default:
        return { spinner: 40, avatar: 60, padding: 3 };
    }
  };

  const { spinner, avatar, padding } = getSizeProps();

  const LoaderContent = () => (
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      sx={{ p: padding }}
    >
      {/* User Avatar Placeholder */}
      <Box sx={{ position: 'relative' }}>
        <Avatar
          sx={{
            width: avatar,
            height: avatar,
            bgcolor: 'action.disabled',
            color: 'text.disabled',
          }}
        >
          <Person sx={{ fontSize: avatar * 0.6 }} />
        </Avatar>
        
        {/* Spinning indicator overlay */}
        <CircularProgress
          size={spinner}
          thickness={2}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.palette.primary.main,
          }}
        />
      </Box>

      {/* Loading message */}
      <Typography
        variant={size === 'small' ? 'body2' : 'body1'}
        color="text.secondary"
        textAlign="center"
        sx={{ maxWidth: 200 }}
      >
        {message}
      </Typography>

      {/* Optional loading dots animation */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          '& .dot': {
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: 'pulse 1.5s ease-in-out infinite',
            '&:nth-of-type(2)': {
              animationDelay: '0.2s',
            },
            '&:nth-of-type(3)': {
              animationDelay: '0.4s',
            },
          },
          '@keyframes pulse': {
            '0%, 60%, 100%': {
              opacity: 0.3,
              transform: 'scale(0.8)',
            },
            '30%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      >
        <Box className="dot" />
        <Box className="dot" />
        <Box className="dot" />
      </Box>
    </Stack>
  );

  // Render based on variant
  switch (variant) {
    case 'minimal':
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoaderContent />
        </Box>
      );

    case 'fullscreen':
      return (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            zIndex: theme.zIndex.modal,
          }}
        >
          <LoaderContent />
        </Box>
      );

    default: // card variant
      return (
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <LoaderContent />
        </Paper>
      );
  }
};
