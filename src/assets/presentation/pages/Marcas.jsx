import React, { useState } from 'react';
import { Box, Stack, Button, Alert, Snackbar, IconButton, Tooltip, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalMarca } from '../components/Modal/ModalMarca';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { useMarcas } from '../hooks/useMarcas';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import { MarcaProvider } from '../contexts/MarcaContext';

const MarcasContent = () => {
  const { marcas, loading, createMarca, updateMarca, deleteMarca } = useMarcas();
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
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
          <Tooltip title="Editar marca">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar marca">
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
  const rows = marcas.map((marca, index) => ({
    id: marca.id,
    numero: index + 1,
    nombre: marca.nombre,
    descripcion: marca.descripcion || '-',
  }));

  const openDeleteModal = (marca) => {
    const marcaData = marcas.find(c => c.id === marca.id);
    setMarcaToDelete(marcaData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setMarcaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!marcaToDelete) return;
    
    setDeleteLoading(true);
    const result = await deleteMarca(marcaToDelete.id);
    
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

  const openModalHandler = (mode = 'create', marca = null) => {
    setModalMode(mode);
    setSelectedMarca(marca);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setSelectedMarca(null);
  };

  const handleEdit = (marca) => {
    const marcaData = marcas.find(c => c.id === marca.id);
    openModalHandler('edit', marcaData);
  };

  const handleSaveMarca = async (marcaData) => {
    let result;
    if (modalMode === 'create') {
      result = await createMarca(marcaData);
    } else {
      result = await updateMarca(selectedMarca.id, marcaData);
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
    return <Preloader message="Cargando marcas..." />;
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
          startIcon={<BrandingWatermarkIcon />}
        >
          Agregar Marca
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
      
      <ModalMarca 
        open={openModal} 
        onClose={closeModalHandler}
        mode={modalMode}
        marcaData={selectedMarca}
        onSave={handleSaveMarca}
      />

      <ModalEliminar
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Marca"
        itemName={marcaToDelete?.nombre}
        itemId={marcaToDelete?.id}
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

export const Marcas = () => {
  return (
    <MarcaProvider>
      <MarcasContent />
    </MarcaProvider>
  );
};