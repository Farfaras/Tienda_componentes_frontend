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
import { Preloader } from '../components/Preloader';
import { PDFViewerModal } from '../components/Modal/PDFViewerModal';
import { apiClient } from '../../infrastructure/api/axiosConfig';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BlockIcon from '@mui/icons-material/Block';

export const ReporteAnuladosCotizacion = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Obtener fecha actual para los placeholders
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  const [fechaInicio, setFechaInicio] = useState(todayFormatted);
  const [fechaFin, setFechaFin] = useState(todayFormatted);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar cotizaciones anuladas
  const loadCotizacionesAnuladas = async (fechaInicioParam = null, fechaFinParam = null) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/cotizaciones/anuladas');
      let data = response.data;
      
      // Filtrar por fechas en el frontend
      if (fechaInicioParam) {
        const fechaInicioObj = new Date(fechaInicioParam);
        fechaInicioObj.setHours(0, 0, 0, 0);
        data = data.filter(c => {
          const fechaCotizacion = new Date(c.fecha);
          return fechaCotizacion >= fechaInicioObj;
        });
      }
      
      if (fechaFinParam) {
        const fechaFinObj = new Date(fechaFinParam);
        fechaFinObj.setHours(23, 59, 59, 999);
        data = data.filter(c => {
          const fechaCotizacion = new Date(c.fecha);
          return fechaCotizacion <= fechaFinObj;
        });
      }
      
      // Ordenar por ID descendente
      const sortedData = [...data].sort((a, b) => b.id_documento - a.id_documento);
      setCotizaciones(sortedData);
    } catch (error) {
      console.error('Error al cargar cotizaciones anuladas:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al cargar las cotizaciones anuladas',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCotizacionesAnuladas();
  }, []);

  const handleSearch = () => {
    setFiltroActivo(true);
    loadCotizacionesAnuladas(fechaInicio || null, fechaFin || null);
  };

  const handleClearFilters = () => {
    setFechaInicio(todayFormatted);
    setFechaFin(todayFormatted);
    setFiltroActivo(false);
    loadCotizacionesAnuladas(); // Recargar todas sin filtros
  };

  const handleViewPDF = (row) => {
    const cotizacionData = cotizaciones.find(c => c.id_documento === row.id);
    const pdfDataFormatted = {
      nroDocumento: cotizacionData.nro_documento,
      fecha: cotizacionData.fecha,
      fechaVigencia: cotizacionData.fecha_vigencia,
      total: cotizacionData.total,
      cliente: cotizacionData.cliente,
      usuario: cotizacionData.usuario,
      detalles: cotizacionData.detalles
    };
    setPdfData(pdfDataFormatted);
    setOpenPDF(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatTotal = (total) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(parseFloat(total));
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
      width: 100,
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
        </Box>
      )
    },
  ];

  const rows = cotizaciones.map((cotizacion, index) => {
    let fechaVigenciaFormateada = '-';
    if (cotizacion.fecha_vigencia) {
      const d = new Date(cotizacion.fecha_vigencia);
      fechaVigenciaFormateada = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    return {
      id: cotizacion.id_documento,
      numero: index + 1,
      nroDocumento: cotizacion.nro_documento,
      fecha: cotizacion.fecha,
      fechaFormateada: formatDate(cotizacion.fecha),
      fechaVigenciaFormateada,
      clienteNombre: cotizacion.cliente ? `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellido}` : 'Cliente no especificado',
      total: cotizacion.total,
      totalFormateado: formatTotal(cotizacion.total),
      cotizacionData: cotizacion
    };
  });

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 3 }}>
      {/* Header con ícono */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <BlockIcon sx={{ color: '#ef4444' }} />
        <Typography variant="h5" fontWeight="bold">
          Cotizaciones Anuladas
        </Typography>
      </Stack>

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
        Mostrando {rows.length} cotización{rows.length !== 1 ? 'es' : ''} anulada{rows.length !== 1 ? 's' : ''}
        {filtroActivo && ' (filtradas por fecha)'}
      </Typography>

      {/* Tabla de cotizaciones anuladas */}
      {loading ? (
        <Preloader message="Cargando cotizaciones anuladas..." fullScreen={false} />
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