// src/presentation/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { LoginUseCase } from '../../core/usecases/auth/LoginUseCase';
import { Verify2FAUseCase } from '../../core/usecases/auth/Verify2FAUseCase';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { User } from '../../core/entities/User';
import { apiClient } from '../../infrastructure/api/axiosConfig';

export const AuthContext = createContext(null);

const authRepository = new AuthRepositoryImpl();
const loginUseCase = new LoginUseCase(authRepository);
const verify2FAUseCase = new Verify2FAUseCase(authRepository);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tempEmail, setTempEmail] = useState(null);

  // Verificar token con el backend
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      // Intentar obtener el usuario actual para verificar si el token es válido
      const response = await apiClient.get('/auth/me');
      
      if (response.data) {
        const userData = new User(response.data);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Token válido, usuario autenticado:', userData.nombre);
        return true;
      }
    } catch (error) {
      console.error('❌ Token inválido o expirado:', error.response?.status);
      
      // Token inválido, limpiar localStorage
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (credentials) => {
    const result = await loginUseCase.execute(credentials);
    
    if (result.success && result.requiresTwoFactor) {
      setTempEmail(result.email);
      return { requiresTwoFactor: true, email: result.email };
    }
    
    return result;
  };

  const verify2FA = useCallback(async (code) => {
    if (!tempEmail) {
      return { success: false, error: 'No hay email temporal para verificación' };
    }
    
    try {
      const result = await verify2FAUseCase.execute({
        email: tempEmail,
        code: code
      });
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        setTempEmail(null);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [tempEmail]);

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setTempEmail(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    verify2FA,
    logout,
    tempEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};