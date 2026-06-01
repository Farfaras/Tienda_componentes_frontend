import { useContext } from 'react';
import { UsuarioActualContext } from '../contexts/UsuarioActualContext';

export const useUsuarioActual = () => {
  const context = useContext(UsuarioActualContext);
  
  if (!context) {
    throw new Error('useUsuarioActual must be used within UsuarioActualProvider');
  }
  
  return context;
};