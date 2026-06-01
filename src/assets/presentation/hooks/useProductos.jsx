import { useContext } from 'react';
import { ProductoContext } from '../contexts/ProductoContext';

export const useProductos = () => {
  const context = useContext(ProductoContext);
  
  if (!context) {
    throw new Error('useProductos must be used within ProductoProvider');
  }
  
  return context;
};