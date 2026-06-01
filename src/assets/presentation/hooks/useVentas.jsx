import { useContext } from 'react';
import { VentaContext } from '../contexts/VentaContext';

export const useVentas = () => {
  const context = useContext(VentaContext);
  
  if (!context) {
    throw new Error('useVentas must be used within VentaProvider');
  }
  
  return context;
};