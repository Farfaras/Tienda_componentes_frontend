import { useContext } from 'react';
import { VentaReporteContext } from '../contexts/VentaReporteContext';

export const useVentasReporte = () => {
  const context = useContext(VentaReporteContext);
  
  if (!context) {
    throw new Error('useVentasReporte must be used within VentaReporteProvider');
  }
  
  return context;
};