import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Stack, Alert, CircularProgress } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useThemeContext } from '../../contexts/ThemeContext';

export const ModalCliente = ({ open, onClose, mode = 'create', clienteData = null, onSave }) => {
  const { mode: themeMode } = useThemeContext();
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    telefono: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (clienteData && mode === 'edit') {
      setFormData({
        ci: clienteData.ci || '',
        nombre: clienteData.nombre || '',
        apellido: clienteData.apellido || '',
        telefono: clienteData.telefono || '',
        estado: true,
      });
    } else {
      setFormData({
        ci: '',
        nombre: '',
        apellido: '',
        telefono: '',
        estado: true
      }); 
    }
    setErrors({});
    setGeneralError('');
  }, [clienteData, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (generalError) setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ci.trim()) newErrors.ci = 'El CI es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (formData.telefono && formData.telefono.length < 8) {
      newErrors.telefono = 'El teléfono debe tener al menos 8 dígitos';
    }

    if (formData.ci && formData.ci.length < 7) {
      newErrors.ci = 'El CI debe ser mayor a 7 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para traducir errores del backend
  const translateBackendErrors = (errorResponse) => {
    const translatedErrors = {};
    
    if (errorResponse.errors) {
      // Traducir error de CI duplicado
      if (errorResponse.errors.ci) {
        if (errorResponse.errors.ci[0].includes('already been taken')) {
          translatedErrors.ci = 'El CI ya está registrado. Por favor, use otro.';
        } else {
          translatedErrors.ci = errorResponse.errors.ci[0];
        }
      }
      
      // Traducir error de teléfono si viene
      if (errorResponse.errors.telefono) {
        translatedErrors.telefono = errorResponse.errors.telefono[0];
      }
      
      // Traducir error de nombre
      if (errorResponse.errors.nombre) {
        translatedErrors.nombre = errorResponse.errors.nombre[0];
      }
      
      // Traducir error de apellido
      if (errorResponse.errors.apellido) {
        translatedErrors.apellido = errorResponse.errors.apellido[0];
      }
    }
    
    return translatedErrors;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setGeneralError('');
    setErrors({});
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving cliente:', error);
      
      // Verificar si el error tiene la estructura de respuesta del backend
      if (error.response?.data) {
        const backendError = error.response.data;
        
        // Traducir errores del backend
        const translatedFieldErrors = translateBackendErrors(backendError);
        
        if (Object.keys(translatedFieldErrors).length > 0) {
          setErrors(translatedFieldErrors);
        } else if (backendError.message) {
          // Traducir mensaje general
          if (backendError.message.includes('already been taken')) {
            setGeneralError('El CI ya está registrado. No se puede duplicar.');
          } else {
            setGeneralError(backendError.message);
          }
        } else {
          setGeneralError('Ocurrió un error al guardar el cliente. Intente nuevamente.');
        }
      } else if (error.message) {
        setGeneralError(error.message);
      } else {
        setGeneralError('Ocurrió un error al guardar el cliente. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'create' ? 'Agregar Cliente' : 'Editar Cliente';
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
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
          {/* Error general */}
          {generalError && (
            <Alert severity="error" sx={{ width: '100%' }} onClose={() => setGeneralError('')}>
              {generalError}
            </Alert>
          )}

          <TextField
            label="Cédula de Identidad (CI)"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.ci}
            helperText={errors.ci}
            disabled={loading}
          />

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
              disabled={loading}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.apellido}
              helperText={errors.apellido}
              disabled={loading}
            />
          </Stack>

          <TextField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.telefono}
            helperText={errors.telefono || "Ejemplo: 77012345"}
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