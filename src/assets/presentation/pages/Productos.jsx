import React, { useState } from 'react';
import { Box, Stack, Button, Alert, Snackbar, IconButton, Tooltip, Avatar } from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalProducto } from '../components/Modal/ModalProducto';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { useMarcas } from '../hooks/useMarcas';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { ProductoProvider } from '../contexts/ProductoContext';
import { CategoriaProvider } from '../contexts/CategoriaContext';
import { MarcaProvider } from '../contexts/MarcaContext';

const DEFAULT_IMAGE = '/images/default-product.png';

const ProductosContent = () => {
  const { productos, loading, createProducto, updateProducto, deleteProducto } = useProductos();
  const { categorias } = useCategorias();
  const { marcas } = useMarcas();
  
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'numero', headerName: 'N°', width: 70, sortable: true, searchable: false },
    { 
      field: 'imagen', 
      headerName: 'Imagen', 
      width: 80,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Avatar 
          src={row.imagenUrl || DEFAULT_IMAGE} 
          sx={{ width: 40, height: 40 }}
          variant="rounded"
        />
      )
    },
    { field: 'modelo', headerName: 'Modelo', width: 130, sortable: true, searchable: true },
    { field: 'nombre', headerName: 'Nombre', width: 180, sortable: true, searchable: true },
    { field: 'categoria', headerName: 'Categoría', width: 130, sortable: true, searchable: true },
    { field: 'marca', headerName: 'Marca', width: 120, sortable: true, searchable: true },
    { 
      field: 'precio', 
      headerName: 'Precio', 
      width: 120,
      sortable: true,
      searchable: false,
      renderCell: (row) => `Bs. ${row.precio.toFixed(2)}`
    },
    { field: 'stock', headerName: 'Stock', width: 100, sortable: true, searchable: false },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 120,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Editar producto">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar producto">
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

  const rows = productos.map((producto, index) => ({
    id: producto.id,
    numero: index + 1,
    modelo: producto.modelo,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    imagenUrl: producto.imagenUrl,
    precio: producto.precio,
    stock: producto.stock,
    categoria: producto.categoria?.nombre || '-',
    marca: producto.marca?.nombre || '-',
    productoData: producto
  }));

  const openDeleteModal = (productoRow) => {
    setProductoToDelete(productoRow.productoData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productoToDelete) return;
    
    setDeleteLoading(true);
    const result = await deleteProducto(productoToDelete.id);
    
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

  const openModalHandler = (mode = 'create', producto = null) => {
    setModalMode(mode);
    setSelectedProducto(producto);
    setOpenModal(true);
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    setSelectedProducto(null);
  };

  const handleEdit = (productoRow) => {
    openModalHandler('edit', productoRow.productoData);
  };

  const handleSaveProducto = async (formData, id = null) => {
    let result;
    if (modalMode === 'create') {
      result = await createProducto(formData);
    } else {
      result = await updateProducto(id, formData);
    }
    
    if (result.success) {
      setSnackbar({
        open: true,
        message: result.message,
        severity: 'success'
      });
      closeModalHandler();
    } else if (result.error) {
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
    return <Preloader message="Cargando productos..." fullScreen={false} />;
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 2 }}>
        <Button 
          onClick={() => openModalHandler('create')} 
          variant="contained"
          startIcon={<Inventory2Icon />}
        >
          Agregar Producto
        </Button>
      </Stack>
      
      <DataTable 
        columns={columns} 
        rows={rows} 
        searchable={true}
        searchPlaceholder="Buscar por modelo, nombre, categoría o marca..."
        initialRowsPerPage={5}
        searchFields={[
          { value: 'modelo', label: 'Modelo' },
          { value: 'nombre', label: 'Nombre' },
          { value: 'categoria', label: 'Categoría' },
          { value: 'marca', label: 'Marca' },
        ]}
      />
      
      <ModalProducto 
        open={openModal} 
        onClose={closeModalHandler}
        mode={modalMode}
        productoData={selectedProducto}
        onSave={handleSaveProducto}
        categorias={categorias}
        marcas={marcas}
      />

      <ModalEliminar
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        itemName={`${productoToDelete?.nombre} (${productoToDelete?.modelo})`}
        itemId={productoToDelete?.id}
        loading={deleteLoading}
      />
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
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

export const Productos = () => {
  return (
    <CategoriaProvider>
      <MarcaProvider>
        <ProductoProvider>
          <ProductosContent />
        </ProductoProvider>
      </MarcaProvider>
    </CategoriaProvider>
  );
};