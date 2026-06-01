import { useContext } from 'react';
import { MarcaContext } from '../contexts/MarcaContext';

export const useMarcas = () => {
  const context = useContext(MarcaContext);
  
  if (!context) {
    throw new Error('useMarcas must be used within MarcaProvider');
  }
  
  return context;
};