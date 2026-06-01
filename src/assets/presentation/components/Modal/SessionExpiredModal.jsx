import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Fade
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LoginIcon from '@mui/icons-material/Login';
import { useThemeContext } from '../../contexts/ThemeContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90%',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  textAlign: 'center',
};

const SessionExpiredModal = ({ open, onLogin }) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Modal open={open} closeAfterTransition BackdropProps={{ timeout: 500 }}>
      <Fade in={open}>
        <Paper
          elevation={24}
          sx={{
            ...modalStyle,
            bgcolor: isDark ? '#1E293B' : '#FFFFFF',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                mb: 2,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
            </Box>

            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              Sesión Expirada
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tu sesión ha expirado por seguridad. Por favor, inicia sesión nuevamente para continuar.
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={onLogin}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                bgcolor: '#3B82F6',
                '&:hover': { bgcolor: '#2563EB' }
              }}
            >
              Aceptar
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
};


export default SessionExpiredModal;