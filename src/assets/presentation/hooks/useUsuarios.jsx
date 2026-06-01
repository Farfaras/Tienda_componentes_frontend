import { useContext } from 'react';
import { UsuarioContext } from '../contexts/UsuarioContext';

export const useUsuarios = () => {
  const context = useContext(UsuarioContext);
  
  if (!context) {
    throw new Error('useUsuarios must be used within UsuarioProvider');
  }
  
  return context;
};