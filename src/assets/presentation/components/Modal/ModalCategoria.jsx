import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Stack, CircularProgress, Alert } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useThemeContext } from '../../../presentation/contexts/ThemeContext';

export const ModalCategoria = ({ open, onClose, mode, categoriaData, onSave }) => {
  const { mode: themeMode } = useThemeContext();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (mode === 'edit' && categoriaData) {
      setFormData({
        nombre: categoriaData.nombre || '',
        descripcion: categoriaData.descripcion || '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
      });
    }
    setErrors({});
  }, [mode, categoriaData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave({ ...formData, estado: true });
      onClose();
    } catch (error) {
      console.error('Error saving categoria:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'create' ? 'Agregar Categoría' : 'Editar Categoría';
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90%',
    bgcolor: isDark ? '#1E293B' : '#FFFFFF',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ width: '100%' }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {getTitle()}
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ mt: 3, width: '100%' }}>
          {errors.general && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {errors.general}
            </Alert>
          )}

          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            autoFocus
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={loading}
          />

          <TextField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            fullWidth
            size="small"
            multiline
            rows={3}
            disabled={loading}
          />

          <Divider sx={{ width: '100%' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: '100%' }}>
            <Button 
              variant="outlined" 
              onClick={onClose} 
              disabled={loading}
              sx={{
                color: isDark ? '#E2E8F0' : '#555',
                borderColor: isDark ? '#94A3B8' : '#E2E8F0',
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ backgroundColor: '#3B82F6' }}
            >
              {loading ? <CircularProgress size={24} /> : (mode === 'create' ? 'Guardar' : 'Actualizar')}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};