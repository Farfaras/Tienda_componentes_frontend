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
  IconButton,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ModalEliminar = ({
  open,
  onClose,
  onConfirm,
  title = "Eliminar registro",
  message = "¿Estás seguro de que descartar este registro?",
  itemName = "",
  itemId = null,
  loading = false,
  confirmText = "Eliminar",
  cancelText = "Cancelar"
}) => {
  const theme = useTheme();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(itemId);
    }
  };

  const getMessageText = () => {
    if (itemName) {
      return `¿Estás seguro de realizar esta acción para "${itemName}"?`;
    }
    return message;
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      closeAfterTransition
      PaperProps={{
        sx: {
          borderRadius: 4,
          minWidth: { xs: '90%', sm: 420 },
          maxWidth: 450,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }
      }}
    >
      <Fade in={open} timeout={300}>
        <Box>
          {/* Header con círculo rojo y X blanca */}
          <Box
            sx={{
              position: 'relative',
              textAlign: 'center',
              pt: 0.5,
              pb: 0.5,
              bgcolor: 'error.main',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            }}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={onClose}
              disabled={loading}
              sx={{
                position: 'absolute',
                right: 12,
                top: 12,
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Círculo blanco con X */}
            {/* <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: 48,
                  color: '#dc2626',
                  fontWeight: 'bold',
                }}
              />
            </Box> */}

            {/* Título */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#ffffff',
                mt: 2,
                mb: 1,
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Contenido */}
          <DialogContent sx={{ textAlign: 'center', pt: 3, pb: 2 }}>
            <DialogContentText component="div">
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                {getMessageText()}
              </Typography>
              
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  bgcolor: theme.palette.mode === 'light' 
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(239, 68, 68, 0.15)',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <WarningAmberIcon sx={{ fontSize: 18 }} />
                  Esta acción no se puede deshacer
                </Typography>
              </Box>
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
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : confirmText}
            </Button>
          </DialogActions>
        </Box>
      </Fade>
    </Dialog>
  );
};
