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
import { useCotizacionesReporte } from '../hooks/useCotizacionesReporte';
import { CotizacionReporteProvider } from '../contexts/CotizacionReporteContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const ReporteCotizacionContent = () => {
  const { cotizaciones, loading, loadCotizaciones, anularCotizacion } = useCotizacionesReporte();
  
  // Obtener fecha actual para los placeholders
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  const [fechaInicio, setFechaInicio] = useState(todayFormatted);
  const [fechaFin, setFechaFin] = useState(todayFormatted);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cotizacionToDelete, setCotizacionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar todas las cotizaciones al inicio (sin filtros)
  useEffect(() => {
    loadCotizaciones();
  }, []);

  const handleSearch = () => {
    setFiltroActivo(true);
    loadCotizaciones(fechaInicio || null, fechaFin || null);
  };

  const handleClearFilters = () => {
    setFechaInicio(todayFormatted);
    setFechaFin(todayFormatted);
    setFiltroActivo(false);
    loadCotizaciones(); // Cargar todas sin filtros
  };

  const handleViewPDF = (row) => {
    const cotizacionData = cotizaciones.find(c => c.id === row.id);
    setPdfData(cotizacionData);
    setOpenPDF(true);
  };

  const openDeleteModal = (row) => {
    const cotizacionData = cotizaciones.find(c => c.id === row.id);
    setCotizacionToDelete(cotizacionData);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCotizacionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!cotizacionToDelete) return;
    
    setDeleteLoading(true);
    const result = await anularCotizacion(cotizacionToDelete.id);
    
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
      field: 'fechaVigenciaFormateada', 
      headerName: 'Vigencia', 
      width: 120,
      sortable: true,
      searchable: false,
      renderCell: (row) => row.fechaVigenciaFormateada || '-'
    },
    { 
      field: 'accion', 
      headerName: 'Acción', 
      width: 120,
      sortable: false,
      searchable: false,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title="Ver cotización">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewPDF(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Anular cotización">
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

  // Construir rows a partir de cotizaciones
  const rows = cotizaciones.map((cotizacion, index) => {
    let fechaFormateada = '-';
    if (cotizacion.fecha) {
      const d = new Date(cotizacion.fecha);
      fechaFormateada = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    let fechaVigenciaFormateada = '-';
    if (cotizacion.fechaVigencia) {
      const d = new Date(cotizacion.fechaVigencia);
      fechaVigenciaFormateada = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    return {
      id: cotizacion.id,
      numero: index + 1,
      nroDocumento: cotizacion.nroDocumento,
      fecha: cotizacion.fecha,
      fechaFormateada,
      fechaVigenciaFormateada,
      clienteNombre: cotizacion.cliente ? `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellido}` : 'Cliente no especificado',
      total: cotizacion.total,
      totalFormateado: `Bs ${cotizacion.total?.toFixed(2)}`,
      cotizacionData: cotizacion
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
        Mostrando {rows.length} cotización{rows.length !== 1 ? 'es' : ''}
        {filtroActivo && ' (filtradas por fecha)'}
      </Typography>

      {/* Tabla de cotizaciones con Preloader */}
      {loading ? (
        <Preloader message="Cargando cotizaciones..." fullScreen={false} />
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
        title="Anular Cotización"
        message={`¿Estás seguro de que deseas anular la cotización N° ${cotizacionToDelete?.nroDocumento}?`}
        itemName={`Cotización N° ${cotizacionToDelete?.nroDocumento}`}
        itemId={cotizacionToDelete?.id}
        loading={deleteLoading}
        confirmText="Anular"
        deleteColor="error"
      />

      {/* Modal de PDF */}
      <PDFViewerModal
        open={openPDF}
        onClose={() => setOpenPDF(false)}
        data={pdfData}
        tipo="cotizacion"
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

export const ReporteCotizacion = () => {
  return (
    <CotizacionReporteProvider>
      <ReporteCotizacionContent />
    </CotizacionReporteProvider>
  );
};