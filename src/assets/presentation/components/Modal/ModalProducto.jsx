import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  MenuItem,
  InputAdornment,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { useThemeContext } from '../../../presentation/contexts/ThemeContext';

const DEFAULT_IMAGE = '/images/default-product.png';

export const ModalProducto = ({ 
  open, 
  onClose, 
  mode, 
  productoData, 
  onSave,
  categorias = [],
  marcas = []
}) => {
  const { mode: themeMode } = useThemeContext();
  const [formData, setFormData] = useState({
    modelo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: '',
    id_marca: '',
    imagen: null,
    imagenPreview: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (mode === 'edit' && productoData) {
      setFormData({
        modelo: productoData.modelo || '',
        nombre: productoData.nombre || '',
        descripcion: productoData.descripcion || '',
        precio: productoData.precio || '',
        stock: productoData.stock || '',
        id_categoria: productoData.categoriaId || '',
        id_marca: productoData.marcaId || '',
        imagen: null,
        imagenPreview: productoData.imagenUrl || DEFAULT_IMAGE
      });
    } else {
      setFormData({
        modelo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: '',
        id_marca: '',
        imagen: null,
        imagenPreview: DEFAULT_IMAGE
      });
    }
    setErrors({});
  }, [mode, productoData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file,
        imagenPreview: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.modelo || formData.modelo.trim() === '') {
      newErrors.modelo = 'El modelo es requerido';
    }
    if (!formData.nombre || formData.nombre.trim() === '') {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    if (!formData.id_categoria) {
      newErrors.id_categoria = 'La categoría es requerida';
    }
    if (!formData.id_marca) {
      newErrors.id_marca = 'La marca es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const submitData = new FormData();
      
      if (mode === 'edit') {
        submitData.append('_method', 'PUT');
      }
      
      submitData.append('modelo', formData.modelo);
      submitData.append('nombre', formData.nombre);
      submitData.append('descripcion', formData.descripcion || '');
      submitData.append('precio', formData.precio.toString());
      submitData.append('stock', formData.stock || '0');
      submitData.append('id_categoria', formData.id_categoria.toString());
      submitData.append('id_marca', formData.id_marca.toString());
      
      // Enviar estado como 1 (activo) por defecto
      submitData.append('estado', '1');
      
      if (formData.imagen && formData.imagen instanceof File) {
        submitData.append('imagen', formData.imagen);
      }

      await onSave(submitData, mode === 'edit' ? productoData?.id : null);
      onClose();
    } catch (error) {
      console.error('Error saving producto:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return mode === 'create' ? 'Agregar Producto' : 'Editar Producto';
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    maxWidth: '90%',
    bgcolor: isDark ? '#1E293B' : '#FFFFFF',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
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

          <Box display="flex" justifyContent="center" sx={{ width: '100%' }}>
            <Avatar
              src={formData.imagenPreview}
              sx={{ width: 120, height: 120 }}
              variant="rounded"
            />
          </Box>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              color: isDark ? '#E2E8F0' : '#555',
              borderColor: isDark ? '#94A3B8' : '#E2E8F0',
            }}
          >
            {mode === 'edit' ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextField
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.modelo}
              helperText={errors.modelo}
              disabled={loading}
            />
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
          </Stack>

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

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextField
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.precio}
              helperText={errors.precio}
              disabled={loading}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={loading}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <TextField
              select
              label="Categoría"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.id_categoria}
              helperText={errors.id_categoria}
              disabled={loading}
            >
              <MenuItem value="">Seleccione una categoría</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Marca"
              name="id_marca"
              value={formData.id_marca}
              onChange={handleChange}
              fullWidth
              size="small"
              required
              error={!!errors.id_marca}
              helperText={errors.id_marca}
              disabled={loading}
            >
              <MenuItem value="">Seleccione una marca</MenuItem>
              {marcas.map((marca) => (
                <MenuItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </MenuItem>
              ))}
            </TextField>
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