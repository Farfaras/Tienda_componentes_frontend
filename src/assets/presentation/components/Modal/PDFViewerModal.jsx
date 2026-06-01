import React from 'react';
import { Modal, Box, IconButton, useTheme } from '@mui/material';
import { PDFViewer } from '@react-pdf/renderer';
import CloseIcon from '@mui/icons-material/Close';
import { CotizacionPDF } from '../PDF/CotizacionPDF';
import { VentaPDF } from '../PDF/VentaPDF';

export const PDFViewerModal = ({ open, onClose, data, tipo = 'cotizacion' }) => {
  const theme = useTheme();

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
    boxShadow: 24,
    borderRadius: 2,
    overflow: 'hidden',
  };

  if (!data) return null;

  const PDFComponent = tipo === 'cotizacion' ? CotizacionPDF : VentaPDF;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header con botón cerrar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1,
            bgcolor: '#3B82F6',
          }}
        >
          <IconButton onClick={onClose} sx={{ color: '#FFFFFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Visor PDF */}
        <Box sx={{ height: 'calc(100% - 52px)' }}>
          <PDFViewer width="100%" height="100%">
            <PDFComponent data={data} />
          </PDFViewer>
        </Box>
      </Box>
    </Modal>
  );
};