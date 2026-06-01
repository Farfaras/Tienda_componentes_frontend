// src/presentation/components/Verify2FAModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  Fade
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useUsuarioActual } from '../hooks/useUsuarioActual';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const Verify2FAModal = ({ open, onClose, email, onSuccess }) => {
  const { verify2FA } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useUsuarioActual();

  // Auto-focus al abrir y limpiar estado
  useEffect(() => {
    if (open) {
      setCode('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await verify2FA(code);
      if (result.success) {
        // 👈 Guardar tiempo de expiración si viene en el resultado
        if (result.expires_in_minutes) {
          const expiresAt = Date.now() + (result.expires_in_minutes * 60 * 1000);
          localStorage.setItem('expires_at', expiresAt.toString());
        }
        await refreshUser(); // Si tienes refreshUser
        onSuccess();
      } else {
        setError(result.error || 'Código incorrecto');
      }
    } catch (err) {
      setError(err.message || 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };


  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper elevation={24} sx={modalStyle}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <VerifiedUserIcon sx={{ fontSize: 60, color: '#667eea', mb: 1 }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Autenticación de Dos Factores
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Ingresa el código de Google Authenticator para
              <br />
              <strong>{email}</strong>
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Código de verificación"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                fullWidth
                required
                disabled={loading}
                autoFocus
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                }}
                sx={{
                  '& input': {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    letterSpacing: '4px',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Verificar'}
              </Button>
              <Button
                onClick={onClose}
                variant="outlined"
                fullWidth
                disabled={loading}
              >
                Cancelar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default Verify2FAModal;