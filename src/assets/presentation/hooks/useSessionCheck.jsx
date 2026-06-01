// src/presentation/hooks/useSessionCheck.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../infrastructure/api/axiosConfig';

export const useSessionCheck = () => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Verificar si el token sigue siendo válido
      await apiClient.get('/auth/me');
    } catch (error) {
      // Si hay error (401 o conexión rechazada), la sesión expiró
      if (error.response?.status === 401 || error.code === 'ERR_CONNECTION_REFUSED') {
        localStorage.removeItem('token');
        setSessionExpired(true);
      }
    }
  };

  // Verificar cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      checkSession();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Verificar cuando la ventana recupera el foco
  useEffect(() => {
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRedirectToLogin = () => {
    setSessionExpired(false);
    navigate('/login');
  };

  return {
    sessionExpired,
    handleRedirectToLogin,
    checkSession
  };
};