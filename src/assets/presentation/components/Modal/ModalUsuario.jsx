import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Stack, MenuItem, Switch, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../contexts/ThemeContext';

const roles = [
  { value: 1, label: 'Administrador' },
  { value: 2, label: 'Vendedor' },
];

export const ModalUsuario = ({ open, onClose, mode = 'create', usuarioData = null, onSave, onShowQR }) => {
  const { user: currentUser } = useAuth();
  const { mode: themeMode } = useThemeContext();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    password: '',
    password_confirmation: '',
    id_rol: 2,
    estado: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isDark = themeMode === 'dark';
  const isEditMode = mode === 'edit';
  const isAdminEdit = isEditMode && usuarioData?.isAdmin();
  const canEditRole = currentUser?.isAdmin() && !isAdminEdit;

  useEffect(() => {
    if (isEditMode && usuarioData) {
      setFormData({
        nombre: usuarioData.nombre || '',
        apellido: usuarioData.apellido || '',
        email: usuarioData.email || '',
        direccion: usuarioData.direccion || '',
        password: '',
        password_confirmation: '',
        id_rol: usuarioData.rolId || 2,
        estado: usuarioData.estado !== undefined ? usuarioData.estado : true
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        direccion: '',
        password: '',
        password_confirmation: '',
        id_rol: 2,
        estado: true
      });
    }
    setErrors({});
  }, [mode, usuarioData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e) => {
    setFormData(prev => ({ ...prev, estado: e.target.checked }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!isEditMode) {
      if (!formData.password) newErrors.password = 'La contraseña es requerida';
      if (formData.password.length > 0 && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden';
      }
    } else {
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const submitData = { ...formData };
      if (isEditMode && !submitData.password) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }
      const result = await onSave(submitData);
      if (result?.requiresQR) {
        onShowQR?.(result);
      }
      if (result?.success !== false) {
        onClose();
      } else if (result?.error) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'create' ? 'Agregar Usuario' : 'Editar Usuario';
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
          <Box display="flex" alignItems="center" gap={1}>
            
            <Typography variant="h6" component="h2" fontWeight="bold">
              {getTitle()}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={3} sx={{ mt: 3, width: '100%' }}>
          {errors.general && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {errors.general}
            </Alert>
          )}

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
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            size="small"
            required
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading || (isEditMode && usuarioData?.id === currentUser?.id)}
          />

          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={loading}
          />

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextField
              label={isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
            />
            <TextField
              label="Confirmar Contraseña"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              disabled={loading}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="center">
            <TextField
              select
              label="Rol"
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={loading || !canEditRole}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>

            {isEditMode && !isAdminEdit && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.estado}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label={formData.estado ? "Activo" : "Inactivo"}
                sx={{ ml: 2 }}
              />
            )}
          </Stack>

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