import { useContext } from 'react';
import { CategoriaContext } from '../contexts/CategoriaContext';

export const useCategorias = () => {
  const context = useContext(CategoriaContext);
  
  if (!context) {
    throw new Error('useCategorias must be used within CategoriaProvider');
  }
  
  return context;
};