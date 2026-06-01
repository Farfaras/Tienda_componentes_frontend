// src/assets/presentation/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Preloader } from '../components/Preloader';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar preloader mientras se verifica el token
  if (loading) {
    return <Preloader message="Verificando sesión..." fullScreen={false} />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};