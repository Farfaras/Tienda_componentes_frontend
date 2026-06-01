import React, { useState } from 'react';
import { Box, Stack, Button, Alert, Snackbar, IconButton, Tooltip, Typography } from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalCliente } from '../components/Modal/ModalCliente';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { useClientes } from '../hooks/useClientes';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ClienteProvider } from '../contexts/ClienteContext';
import PeopleIcon from '@mui/icons-material/People';

const ClientesContent = () => {
  const { clientes, loading, createCliente, updateCliente, deleteCliente } = useClientes();
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'numero', headerName: 'N°', width: 80, sortable: true, searchable: true },
    { field: 'ci', headerName: 'CI', width: 120, sortable: true, searchable: true },
    { field: 'nombreCompleto', headerName: 'Nombre Completo', width: 200, sortable: true, searchable: true },
    { field: 'telefono', headerName: 'Teléfono', width: 150, sortable: true, searchable: true },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 120,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Editar cliente">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar cliente">
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

  const rows = clientes.map((cliente, index) => ({
    id: cliente.id,
    numero: index + 1,
    ci: cliente.ci,
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    nombreCompleto: cliente.nombreCompleto,
    telefono: cliente.telefono,
    estado: cliente.estado
  }));

  const openDeleteModal = (cliente) => {
    const clienteData = clientes.find(c => c.id === cliente.id);
    setClienteToDelete(clienteData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setClienteToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;
    
    setDeleteLoading(true);
    const result = await deleteCliente(clienteToDelete.id);
    
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

  const openModalHandler = (mode = 'create', cliente = null) => {
    setModalMode(mode);
    setSelectedCliente(cliente);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setSelectedCliente(null);
  };

  const handleEdit = (cliente) => {
    const clienteData = clientes.find(c => c.id === cliente.id);
    openModalHandler('edit', clienteData);
  };

  const handleSaveCliente = async (clienteData) => {
    let result;
    if (modalMode === 'create') {
      result = await createCliente(clienteData);
    } else {
      result = await updateCliente(selectedCliente.id, clienteData);
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

  // 👇 Mostrar preloader mientras carga
  if (loading) {
    return <Preloader message="Cargando clientes..." fullScreen={false} />;
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{mb:2}}>
          Gestión de Clientes
        </Typography>
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 2 }}>
        <Button 
          onClick={() => openModalHandler('create')} 
          variant="contained"
          startIcon={<PeopleIcon />}
        >
          Agregar Cliente
        </Button>
      </Stack>
      
      <DataTable 
        columns={columns} 
        rows={rows} 
        searchable={true}
        searchPlaceholder="Buscar por nombre, apellido, ci o teléfono..."
        initialRowsPerPage={5}
        searchFields={[
          { value: 'nombreCompleto', label: 'Nombre Completo' },
          { value: 'ci', label: 'CI' },
          { value: 'telefono', label: 'Teléfono' },
        ]}
      />
      
      <ModalCliente 
        open={openModal} 
        onClose={closeModalHandler}
        mode={modalMode}
        clienteData={selectedCliente}
        onSave={handleSaveCliente}
      />

      <ModalEliminar
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        itemName={clienteToDelete?.nombreCompleto}
        itemId={clienteToDelete?.id}
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

export const Clientes = () => {
  return (
    <ClienteProvider>
      <ClientesContent />
    </ClienteProvider>
  );
};