import { useContext } from 'react';
import { CotizacionContext } from '../contexts/CotizacionContext';

export const useCotizaciones = () => {
  const context = useContext(CotizacionContext);
  
  if (!context) {
    throw new Error('useCotizaciones must be used within CotizacionProvider');
  }
  
  return context;
};