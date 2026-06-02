import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { apiClient } from '../../../infrastructure/api/axiosConfig';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const AIAnalysisModal = ({ open, onClose, title, endpoint }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    setAnalysis('');
    
    try {
      const response = await apiClient.get(endpoint);
      if (response.data.success) {
        setAnalysis(response.data.analysis);
      } else {
        setError(response.data.message || 'Error al obtener el análisis');
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchAnalysis();
    }
  }, [open, endpoint]);

  const formatAnalysis = (text) => {
    if (!text) return '';
    // Convertir markdown básico a HTML
    return text
      .split('\n')
      .map(line => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return `<strong style="color: ${isDark ? '#60A5FA' : '#2563EB'}">${line.slice(2, -2)}</strong>`;
        }
        if (line.startsWith('* ')) {
          return `<li style="margin-left: 20px; margin-top: 5px;">${line.slice(2)}</li>`;
        }
        if (line.match(/^\d+\./)) {
          return `<li style="margin-left: 20px; margin-top: 5px; font-weight: bold;">${line}</li>`;
        }
        if (line.trim() === '') {
          return '<br/>';
        }
        return `<p style="margin: 8px 0;">${line}</p>`;
      })
      .join('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
    >
      <Box sx={{ ...modalStyle, bgcolor: isDark ? '#1E293B' : '#FFFFFF' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon sx={{ color: '#3B82F6', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#E2E8F0' : '#64748B' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Contenido */}
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
              <CircularProgress size={50} sx={{ color: '#3B82F6' }} />
              <Typography variant="body1" sx={{ mt: 3, color: isDark ? '#94A3B8' : '#64748B' }}>
                Generando análisis con IA...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: '55vh',
                overflowY: 'auto',
                p: 2,
                bgcolor: isDark ? '#0F172A' : '#F8FAFC',
                borderRadius: 2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: isDark ? '#334155' : '#E2E8F0',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#3B82F6',
                  borderRadius: '4px',
                },
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
                style={{
                  color: isDark ? '#E2E8F0' : '#1E293B',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  fontFamily: 'inherit',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: '#3B82F6',
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              '&:hover': { bgcolor: '#2563EB' }
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AIAnalysisModal;