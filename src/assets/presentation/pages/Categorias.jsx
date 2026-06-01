import React, { useState } from 'react';
import { Box, Stack, Button, Alert, Snackbar, IconButton, Tooltip, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalCategoria } from '../components/Modal/ModalCategoria';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { useCategorias } from '../hooks/useCategorias';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import { CategoriaProvider } from '../contexts/CategoriaContext';

const CategoriasContent = () => {
  const { categorias, loading, createCategoria, updateCategoria, deleteCategoria } = useCategorias();
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'numero', headerName: 'N°', width: 80, sortable: true, searchable: false },
    { field: 'nombre', headerName: 'Nombre', width: 250, sortable: true, searchable: true },
    { field: 'descripcion', headerName: 'Descripción', width: 450, sortable: true, searchable: true },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 120,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Editar categoría">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar categoría">
            <IconButton
              color="error"
              size="small"
              onClick={() => openDeleteModal(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  // Preparar datos para la tabla con número secuencial
  const rows = categorias.map((categoria, index) => ({
    id: categoria.id,
    numero: index + 1,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion || '-',
  }));

  const openDeleteModal = (categoria) => {
    const categoriaData = categorias.find(c => c.id === categoria.id);
    setCategoriaToDelete(categoriaData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoriaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoriaToDelete) return;
    
    setDeleteLoading(true);
    const result = await deleteCategoria(categoriaToDelete.id);
    
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      closeDeleteModal();
    } else {
      setSnackbar({
        open: true,
        message: result.error,
        severity: 'error'
      });
    }
    setDeleteLoading(false);
  };

  const openModalHandler = (mode = 'create', categoria = null) => {
    setModalMode(mode);
    setSelectedCategoria(categoria);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setSelectedCategoria(null);
  };

  const handleEdit = (categoria) => {
    const categoriaData = categorias.find(c => c.id === categoria.id);
    openModalHandler('edit', categoriaData);
  };

  const handleSaveCategoria = async (categoriaData) => {
    let result;
    if (modalMode === 'create') {
      result = await createCategoria(categoriaData);
    } else {
      result = await updateCategoria(selectedCategoria.id, categoriaData);
    }
    
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      closeModalHandler();
    } else {
      setSnackbar({
        open: true,
        message: result.error,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <Preloader message="Cargando categorías..." />;
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{mb:2}}>
        Gestión de Categorías
      </Typography>
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 2 }}>
        <Button 
          onClick={() => openModalHandler('create')} 
          variant="contained"
          startIcon={<CategoryIcon />}
        >
          Agregar Categoría
        </Button>
      </Stack>
      
      <DataTable 
        columns={columns} 
        rows={rows} 
        searchable={true}
        searchPlaceholder="Buscar por nombre o descripción..."
        initialRowsPerPage={5}
        searchFields={[
          { value: 'nombre', label: 'Nombre' },
          { value: 'descripcion', label: 'Descripción' },
        ]}
      />
      
      <ModalCategoria 
        open={openModal} 
        onClose={closeModalHandler}
        mode={modalMode}
        categoriaData={selectedCategoria}
        onSave={handleSaveCategoria}
      />

      <ModalEliminar
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Categoría"
        itemName={categoriaToDelete?.nombre}
        itemId={categoriaToDelete?.id}
        loading={deleteLoading}
      />
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const Categorias = () => {
  return (
    <CategoriaProvider>
      <CategoriasContent />
    </CategoriaProvider>
  );
};