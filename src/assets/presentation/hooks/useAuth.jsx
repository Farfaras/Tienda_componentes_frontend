import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  // Función para obtener iniciales del usuario
  const getUserInitials = () => {
    if (!context.user) return '';
    const nombre = context.user.nombre || '';
    const apellido = context.user.apellido || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };
  
  // Función para verificar roles
  const hasRole = (roleName) => {
    if (!context.user) return false;
    return context.user.rol?.nombre === roleName;
  };
  
  // ✅ Asegurar que el usuario tenga un id consistente
  const userId = context.user?.id || context.user?.id_usuario;
  
  return {
    ...context,
    userId, // ✅ Agregar userId al return
    getUserInitials,
    hasRole
  };
};