import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

export const Preloader = ({ 
  message = "Cargando...", 
  size = 40,
  fullScreen = false,
  thickness = 4
}) => {
  const theme = useTheme();

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: theme.palette.background.default,
        }),
        ...(!fullScreen && {
          minHeight: '60vh',
        }),
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={thickness} 
        sx={{ color: '#3B82F6' }} 
      />
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );

  return content;
};
