import React, { useState } from 'react';
import { Box, Stack, Button, Alert, Snackbar, IconButton, Tooltip,Typography } from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalUsuario } from '../components/Modal/ModalUsuario';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { QRCodeModal } from '../components/Modal/QRCodeModal';
import { useUsuarios } from '../hooks/useUsuarios';
import { useAuth } from '../hooks/useAuth';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { UsuarioProvider } from '../contexts/UsuarioContext';

const UsuariosContent = () => {
  const { usuarios, loading, createUsuario, updateUsuario, toggleUsuarioEstado, verify2FARegister, currentUser } = useUsuarios();
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [openModal, setOpenModal] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [usuarioToToggle, setUsuarioToToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'numero', headerName: 'N°', width: 70, sortable: true, searchable: false },
    { field: 'nombreCompleto', headerName: 'Nombre Completo', width: 200, sortable: true, searchable: true },
    { field: 'email', headerName: 'Email', width: 230, sortable: true, searchable: true },
    { field: 'direccion', headerName: 'Dirección', width: 200, sortable: true, searchable: true },
    { field: 'rol', headerName: 'Rol', width: 130, sortable: true, searchable: true },
    { 
      field: 'estado', 
      headerName: 'Estado', 
      width: 100,
      sortable: true,
      searchable: false,
      renderCell: (row) => (
        <Box
          sx={{
            display: 'inline-flex',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: row.estado ? '#22c55e20' : '#ef444420',
            color: row.estado ? '#16a34a' : '#dc2626',
          }}
        >
          {row.estado ? 'Activo' : 'Inactivo'}
        </Box>
      )
    },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 130,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {/* Botón Editar - visible para todos excepto administradores que no son el mismo */}
          {(!row.isAdmin || row.id === currentUser?.id) && (
            <Tooltip title="Editar usuario">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(row)}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Botón Activar/Desactivar */}
          {currentUser?.isAdmin() && !row.isAdmin && row.id !== currentUser?.id && (
            <Tooltip title={row.estado ? "Desactivar usuario" : "Activar usuario"}>
              <IconButton
                size="small"
                onClick={() => openToggleModal(row)}
                sx={{
                  color: row.estado ? '#f59e0b' : '#22c55e',
                  '&:hover': { 
                    backgroundColor: row.estado 
                      ? 'rgba(245, 158, 11, 0.1)' 
                      : 'rgba(34, 197, 94, 0.1)'
                  }
                }}
              >
                {row.estado ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    },
  ];

  // Preparar datos para la tabla
  const rows = usuarios.map((usuario, index) => ({
    id: usuario.id,
    numero: index + 1,
    nombreCompleto: usuario.nombreCompleto,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    direccion: usuario.direccion || '-',
    rol: usuario.rol?.nombre || '-',
    estado: usuario.estado,
    isAdmin: usuario.isAdmin(),
    rolId: usuario.rolId,
    usuarioData: usuario
  }));

  // Abrir modal de activar/desactivar
  const openToggleModal = (usuarioRow) => {
    const usuarioData = usuarios.find(u => u.id === usuarioRow.id);
    console.log('📦 Usuario a toggle:', usuarioData);
    console.log('   - estado:', usuarioData?.estado);
    setUsuarioToToggle(usuarioData);
    setToggleModalOpen(true);
  };

  // Cerrar modal de activar/desactivar
  const closeToggleModal = () => {
    setToggleModalOpen(false);
    setUsuarioToToggle(null);
  };

  // Confirmar activar/desactivar
  const handleConfirmToggle = async () => {
    if (!usuarioToToggle) return;
    
    setToggleLoading(true);
    // 👈 Enviar el ID y el estado actual (no el objeto completo)
    const result = await toggleUsuarioEstado(usuarioToToggle.id, usuarioToToggle.estado);
    
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      closeToggleModal();
    } else {
      setSnackbar({
        open: true,
        message: result.error,
        severity: 'error'
      });
    }
    setToggleLoading(false);
  };

  // Abrir modal de crear/editar
  const openModalHandler = (mode = 'create', usuario = null) => {
    setModalMode(mode);
    setSelectedUsuario(usuario);
    setOpenModal(true);
  };

  // Cerrar modal de crear/editar
  const closeModalHandler = () => {
    setOpenModal(false);
    setSelectedUsuario(null);
  };

  // Editar usuario
  const handleEdit = (usuarioRow) => {
    const usuarioData = usuarios.find(u => u.id === usuarioRow.id);
    openModalHandler('edit', usuarioData);
  };

  // Mostrar QR después de crear usuario
  const handleShowQR = (qrResult) => {
    setQrData({
      qr_url: qrResult.qr_url,
      manual_secret: qrResult.manual_secret,
      email: qrResult.email
    });
    setOpenQRModal(true);
  };

  // Verificar código QR
  const handleQRVerify = async (email, code) => {
    return await verify2FARegister({ email, code });
  };

  // Éxito al verificar QR
  const handleQRSuccess = () => {
    setSnackbar({
      open: true,
      message: 'Usuario verificado correctamente',
      severity: 'success'
    });
  };

  // Guardar usuario (crear o editar)
  const handleSaveUsuario = async (usuarioData) => {
    let result;
    if (modalMode === 'create') {
      result = await createUsuario(usuarioData);
      if (result.success && result.user_id) {
        handleShowQR(result);
        closeModalHandler();
        return result;
      }
    } else {
      result = await updateUsuario(selectedUsuario.id, usuarioData);
    }
    
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      closeModalHandler();
    } else if (result.error) {
      throw new Error(result.error);
    }
    return result;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <Preloader message="Cargando usuarios..." />;
  }

  return (
    
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Usuarios
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 2 }}>
        {currentUser?.isAdmin() && (
          <Button 
            onClick={() => openModalHandler('create')} 
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Agregar Usuario
          </Button>
        )}
      </Stack>
      
      <DataTable 
        columns={columns} 
        rows={rows} 
        searchable={true}
        searchPlaceholder="Buscar por nombre, email o dirección..."
        initialRowsPerPage={5}
        searchFields={[
          { value: 'nombreCompleto', label: 'Nombre Completo' },
          { value: 'email', label: 'Email' },
          { value: 'direccion', label: 'Dirección' },
          { value: 'rol', label: 'Rol' },
        ]}
      />
      
      <ModalUsuario 
        open={openModal} 
        onClose={closeModalHandler}
        mode={modalMode}
        usuarioData={selectedUsuario}
        onSave={handleSaveUsuario}
        onShowQR={handleShowQR}
      />

      <QRCodeModal
        open={openQRModal}
        onClose={() => setOpenQRModal(false)}
        qrUrl={qrData?.qr_url}
        manualSecret={qrData?.manual_secret}
        email={qrData?.email}
        onVerify={handleQRVerify}
        onSuccess={handleQRSuccess}
      />

      <ModalEliminar
        open={toggleModalOpen}
        onClose={closeToggleModal}
        onConfirm={handleConfirmToggle}
        title={usuarioToToggle?.estado ? "Desactivar Usuario" : "Activar Usuario"}
        message={usuarioToToggle?.estado 
          ? `¿Estás seguro de que deseas desactivar a "${usuarioToToggle?.nombreCompleto}"? El usuario no podrá iniciar sesión.`
          : `¿Estás seguro de que deseas activar a "${usuarioToToggle?.nombreCompleto}"? El usuario podrá iniciar sesión nuevamente.`
        }
        itemName={usuarioToToggle?.nombreCompleto}
        itemId={usuarioToToggle?.id}
        loading={toggleLoading}
        confirmText={usuarioToToggle?.estado ? "Desactivar" : "Activar"}
        deleteColor={usuarioToToggle?.estado ? "warning" : "success"}
      />
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const Usuarios = () => {
  return (
    <UsuarioProvider>
      <UsuariosContent />
    </UsuarioProvider>
  );
};