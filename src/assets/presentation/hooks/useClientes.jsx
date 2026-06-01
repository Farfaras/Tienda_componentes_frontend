import { useContext } from 'react';
import { ClienteContext } from '../contexts/ClienteContext';

export const useClientes = () => {
  const context = useContext(ClienteContext);
  
  if (!context) {
    throw new Error('useClientes must be used within ClienteProvider');
  }
  
  return context;
};