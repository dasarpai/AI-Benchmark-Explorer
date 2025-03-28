import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
  Divider
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SocialShare from './SocialShare';
import { useThemeContext } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { mode, toggleColorMode } = useThemeContext();
  const isDarkMode = mode === 'dark';

  return (
    <AppBar position="static" sx={{ boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box>
            <Typography variant="h5" component="h1">
              AI Benchmark Explorer
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              Explore benchmark datasets from Papers With Code
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Social Share Component */}
          <SocialShare />
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
          
          <IconButton
            color="inherit"
            onClick={toggleColorMode}
            edge="end"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
