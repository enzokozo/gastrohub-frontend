import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useThemeMode } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useThemeMode();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GastroHub
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;