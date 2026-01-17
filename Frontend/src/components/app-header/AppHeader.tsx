import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  AppBar, 
  Avatar, 
  Toolbar, 
  useTheme, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  IconButton 
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { authService } from "../../services";

const ToolbarContainer = styled.div<{ isDarkMode: boolean }>`
   .content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
   }
   .profile {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .profile-details {
         display: flex;
         flex-direction: column;
         align-items: flex-end;
         text-align: right;
         
         .name {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${props => props.isDarkMode ? '#ffffff' : '#ffffff'};
            line-height: 1.2;
         }
         
         .email {
            font-size: 0.75rem;
            font-weight: 400;
            color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)'};
            line-height: 1.1;
         }
      }
   }
   .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
   }
   
   @media (max-width: 600px) {
      .profile .profile-details {
         display: none;
      }
   }
`;

export function AppHeader() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Create full name from user data
  const fullName = currentUser 
    ? [currentUser.firstName, currentUser.lastName]
        .filter(Boolean)
        .join(' ')
    : 'Loading...';

  const userEmail = currentUser?.email || 'Loading...';

  // Create initials for avatar
  const avatarInitials = currentUser && fullName !== 'Loading...'
    ? fullName
        .split(' ')
        .map(name => name.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await authService.logout();
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ToolbarContainer isDarkMode={isDarkMode}>
      <AppBar>
        <Toolbar>
          <div className="content">
            <div>IAM FLOW</div>
            <div className="header-actions">
              <ThemeToggle />
              <div className="profile">
                <div className="profile-details">
                  <div className="name">{fullName}</div>
                  <div className="email">{userEmail}</div>
                </div>
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{ p: 0 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      backgroundColor: currentUser?.status === 'ACTIVE' 
                        ? theme.palette.success.main 
                        : theme.palette.grey[500],
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  >
                    {avatarInitials}
                  </Avatar>
                </IconButton>
              </div>
              
              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                {/* User Info Header */}
                <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
                  <Avatar 
                    sx={{ 
                      backgroundColor: currentUser?.status === 'ACTIVE' 
                        ? theme.palette.success.main 
                        : theme.palette.grey[500]
                    }}
                  >
                    {avatarInitials}
                  </Avatar>
                  <ListItemText
                    primary={fullName}
                    secondary={userEmail}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </MenuItem>
                
                <Divider />
                
                {/* Menu Items */}  
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </ToolbarContainer>
  );
}
