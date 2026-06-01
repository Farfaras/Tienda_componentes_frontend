import React from 'react';
import { 
  Tooltip, 
  Switch, 
  Box, 
  Typography 
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '../../../presentation/contexts/ThemeContext';

// Switch personalizado
const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 30,
  padding: 0,
  display: 'flex',

  '& .MuiSwitch-switchBase': {
    padding: 2,
    transition: 'all 0.3s',

    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',

      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
  },

  '& .MuiSwitch-thumb': {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
  },

  '& .MuiSwitch-track': {
    borderRadius: 15,
    backgroundColor:
      theme.palette.mode === 'light'
        ? '#CBD5F5'
        : '#334155',
    opacity: 1,
  },
}));

export const ThemeToggle = ({ isSidebarOpen }) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const isDark = mode === 'dark';

  return (
    <Tooltip
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      placement="right"
      arrow
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          px: 2,
          py: 1.5,
          mx: 1,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'background 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={toggleTheme}
      >
        {/* IZQUIERDA: icono */}
        {isSidebarOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isDark ? (
              <DarkModeIcon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <LightModeIcon sx={{ color: theme.palette.text.primary }} />
            )}

            <Typography
              
              sx={{
                ml: 1,
                color: theme.palette.text.primary,
              }}
            >
              {isDark ? 'Oscuro' : 'Claro'}
            </Typography>
          </Box>
        )}

        {/* DERECHA: switch */}
        <ThemeSwitch checked={isDark} />
      </Box>
    </Tooltip>
  );
};