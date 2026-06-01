// src/assets/presentation/components/LogoutModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

export const ModalLogout = ({ open, onClose, onConfirm, loading }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      closeAfterTransition
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: { xs: '90%', sm: 400 },
          backgroundColor: theme.palette.background.paper,
          boxShadow: 24,
        }
      }}
    >
      <Fade in={open} timeout={300}>
        <Box>
          {/* Header con ícono de advertencia */}
          <Box
            sx={{
              position: 'relative',
              textAlign: 'center',
              pt: 3,
              pb: 1,
            }}
          >
            <IconButton
              onClick={onClose}
              disabled={loading}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.text.secondary,
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                borderRadius: '50%',
                backgroundColor: theme.palette.mode === 'light' 
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(245, 158, 11, 0.2)',
                mb: 2,
              }}
            >
              <WarningAmberIcon
                sx={{
                  fontSize: 40,
                  color: '#f59e0b',
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <DialogTitle sx={{ textAlign: 'center', pt: 0, pb: 1 }}>
            <Typography variant="h5" component="span" fontWeight="bold">
              Cerrar Sesión
            </Typography>
          </DialogTitle>

          {/* Contenido */}
          <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
            <DialogContentText component="div">
              <Typography variant="body1" color="text.secondary" gutterBottom>
                ¿Estás seguro de que deseas cerrar sesión?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Deberás volver a iniciar sesión para acceder a tu cuenta.
              </Typography>
            </DialogContentText>
          </DialogContent>

          {/* Acciones */}
          <DialogActions sx={{ px: 3, pb: 3, gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                '&:hover': {
                  borderColor: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant="contained"
              color="error"
              startIcon={loading ? null : <LogoutIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Cerrar Sesión'}
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  );
};

