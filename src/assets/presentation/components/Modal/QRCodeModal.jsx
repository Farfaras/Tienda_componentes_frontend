import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const QRCodeModal = ({ open, onClose, qrUrl, manualSecret, email, onVerify, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(manualSecret);
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Ingrese un código de 6 dígitos');
      return;
    }

    setVerifying(true);
    setError('');
    const result = await onVerify(email, code);
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Código inválido');
    }
    setVerifying(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Configurar Autenticación de Dos Factores
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            1. Escanea el código QR con Google Authenticator
          </Typography>
          {qrUrl && (
            <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <img 
                src={qrUrl} 
                alt="QR Code" 
                style={{ width: 200, height: 200, margin: '0 auto' }}
              />
            </Box>
          )}
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            O ingresa este código manualmente:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 1 }}>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
              {manualSecret}
            </Typography>
            <IconButton onClick={handleCopySecret} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            2. Ingresa el código de verificación
          </Typography>
          <TextField
            fullWidth
            label="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            size="small"
            sx={{ my: 2 }}
            inputProps={{ style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: 4 } }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose}>Cerrar</Button>
        <Button onClick={handleVerify} variant="contained" disabled={verifying}>
          {verifying ? <CircularProgress size={24} /> : 'Verificar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};