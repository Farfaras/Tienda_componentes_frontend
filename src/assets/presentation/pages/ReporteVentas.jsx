import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  TextField,
  Paper,
  Grid,
  Typography
} from '@mui/material';
import { DataTable } from '../components/DataTable/DataTable';
import { ModalEliminar } from '../components/Modal/ModalEliminar';
import { Preloader } from '../components/Preloader';
import { PDFViewerModal } from '../components/Modal/PDFViewerModal';
import { useVentasReporte } from '../hooks/useVentasReporte';
import { VentaReporteProvider } from '../contexts/VentaReporteContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const ReporteVentasContent = () => {
  const { ventas, loading, loadVentas, anularVenta } = useVentasReporte();
  
  // Obtener fecha actual para los placeholders
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  const [fechaInicio, setFechaInicio] = useState(todayFormatted);
  const [fechaFin, setFechaFin] = useState(todayFormatted);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar todas las ventas al inicio (sin filtros)
  useEffect(() => {
    loadVentas();
  }, []);

  const handleSearch = () => {
    setFiltroActivo(true);
    loadVentas(fechaInicio || null, fechaFin || null);
  };

  const handleClearFilters = () => {
    setFechaInicio(todayFormatted);
    setFechaFin(todayFormatted);
    setFiltroActivo(false);
    loadVentas(); // Cargar todas sin filtros
  };

  const handleViewPDF = (row) => {
    const ventaData = ventas.find(v => v.id === row.id);
    setPdfData(ventaData);
    setOpenPDF(true);
  };

  const openDeleteModal = (row) => {
    const ventaData = ventas.find(v => v.id === row.id);
    setVentaToDelete(ventaData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setVentaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!ventaToDelete) return;
    
    setDeleteLoading(true);
    const result = await anularVenta(ventaToDelete.id);
    
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: 'numero', headerName: 'N°', width: 70, sortable: true, searchable: false },
    { field: 'nroDocumento', headerName: 'N° Documento', width: 120, sortable: true, searchable: true },
    { field: 'fechaFormateada', headerName: 'Fecha', width: 120, sortable: true, searchable: false },
    { field: 'clienteNombre', headerName: 'Cliente', width: 250, sortable: true, searchable: true },
    { field: 'totalFormateado', headerName: 'Total', width: 120, sortable: true, searchable: false },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 120,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Ver venta">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewPDF(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Anular venta">
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

  // Construir rows a partir de ventas
  const rows = ventas.map((venta, index) => {
    let fechaFormateada = '-';
    if (venta.fecha) {
      const d = new Date(venta.fecha);
      fechaFormateada = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    return {
      id: venta.id,
      numero: index + 1,
      nroDocumento: venta.nroDocumento,
      fecha: venta.fecha,
      fechaFormateada,
      clienteNombre: venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'Cliente no especificado',
      total: venta.total,
      totalFormateado: `Bs ${venta.total?.toFixed(2)}`,
      ventaData: venta
    };
  });

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{mb:2}}>
        Reporte de Ventas
      </Typography>
      {/* Filtros de fecha */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              size="small"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              size="small"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ bgcolor: '#3B82F6' }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
              >
                Limpiar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Contador de resultados */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Mostrando {rows.length} venta{rows.length !== 1 ? 's' : ''}
        {filtroActivo && ' (filtradas por fecha)'}
      </Typography>

      {/* Tabla de ventas con Preloader */}
      {loading ? (
        <Preloader message="Cargando ventas..." fullScreen={false} />
      ) : (
        <DataTable 
          columns={columns} 
          rows={rows} 
          searchable={true}
          searchPlaceholder="Buscar por N° documento o cliente..."
          initialRowsPerPage={5}
          searchFields={[
            { value: 'nroDocumento', label: 'N° Documento' },
            { value: 'clienteNombre', label: 'Cliente' },
          ]}
        />
      )}

      {/* Modal de anulación */}
      <ModalEliminar
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Anular Venta"
        message={`¿Estás seguro de que deseas anular la venta N° ${ventaToDelete?.nroDocumento}?`}
        itemName={`Venta N° ${ventaToDelete?.nroDocumento}`}
        itemId={ventaToDelete?.id}
        loading={deleteLoading}
        confirmText="Anular"
        deleteColor="error"
      />

      {/* Modal de PDF */}
      <PDFViewerModal
        open={openPDF}
        onClose={() => setOpenPDF(false)}
        data={pdfData}
        tipo="venta"
      />

      {/* Snackbar para mensajes */}
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

export const ReporteVentas = () => {
  return (
    <VentaReporteProvider>
      <ReporteVentasContent />
    </VentaReporteProvider>
  );
};