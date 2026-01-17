import React from "react";
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  useTheme 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate, useLocation } from "react-router";

const drawerWidth = 240;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/app/dashboard'
  },
  {
    id: 'account',
    label: 'Account',
    icon: <AccountCircleIcon />,
    path: '/app/account'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <PeopleIcon />,
    path: '/app/users'
  },
  {
    id: 'roles',
    label: 'Roles',
    icon: <SecurityIcon />,
    path: '/app/roles'
  }
];

export default function AppNavigationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isPathActive = (itemPath: string) => {
    if (itemPath === '/app/dashboard') {
      return location.pathname === '/app/dashboard' || location.pathname === '/app';
    }
    return location.pathname.startsWith(itemPath);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <List>
        {navigationItems.map((item) => {
          const isActive = isPathActive(item.path);
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: isActive ? theme.palette.primary.light : 'transparent',
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderTopRightRadius: isActive ? '1.5rem' : 0,
                  borderBottomRightRadius: isActive ? '1.5rem' : 0,
                  '&:hover': {
                    backgroundColor: isActive 
                      ? theme.palette.primary.light 
                      : theme.palette.action.hover,
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive ? 500 : 400,
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
