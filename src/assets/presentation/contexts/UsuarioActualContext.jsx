// src/presentation/contexts/UsuarioActualContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { UsuarioActualRepositoryImpl } from '../../infrastructure/repositories/UsuarioActualRepositoryImpl';
import { GetCurrentUserUseCase } from '../../core/usecases/auth/GetCurrentUserUseCase';

export const UsuarioActualContext = createContext(null);

const usuarioRepository = new UsuarioActualRepositoryImpl();
const getCurrentUserUseCase = new GetCurrentUserUseCase(usuarioRepository);

export function UsuarioActualProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCurrentUserUseCase.execute();
      if (result.success) {
        setUsuario(result.data);
      } else {
        setError(result.error);
        setUsuario(null);
      }
    } catch (err) {
      setError(err.message);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 Función para recargar el usuario (se llama después del login)
  const refreshUser = useCallback(async () => {
    const result = await getCurrentUserUseCase.execute();
    if (result.success) {
      setUsuario(result.data);
    }
    return result;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCurrentUser();
    } else {
      setLoading(false);
      setUsuario(null);
    }
  }, [loadCurrentUser]);

  const value = {
    usuario,
    loading,
    error,
    loadCurrentUser,
    refreshUser,  // 👈 Exportar esta función
    userId: usuario?.getUserId?.(),
    isAdmin: usuario?.isAdmin?.() || false,
    nombreCompleto: usuario?.nombreCompleto || ''
  };

  return React.createElement(UsuarioActualContext.Provider, { value }, children);
}