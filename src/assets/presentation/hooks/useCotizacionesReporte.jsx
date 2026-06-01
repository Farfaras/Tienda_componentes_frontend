import { useContext } from 'react';
import { CotizacionReporteContext } from '../contexts/CotizacionReporteContext';

export const useCotizacionesReporte = () => {
  const context = useContext(CotizacionReporteContext);
  
  if (!context) {
    throw new Error('useCotizacionesReporte must be used within CotizacionReporteProvider');
  }
  
  return context;
};