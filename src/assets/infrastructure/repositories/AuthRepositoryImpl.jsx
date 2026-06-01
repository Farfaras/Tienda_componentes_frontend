// src/infrastructure/repositories/AuthRepositoryImpl.js
import { AuthRepository } from '../../core/repositories/AuthRepository';
import { apiClient } from '../api/axiosConfig';

export class AuthRepositoryImpl extends AuthRepository {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Capturar el error y devolver el mensaje correctamente
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión');
    }
  }

  async verify2FA(verificationData) {
    try {
      const response = await apiClient.post('/auth/login/verify-2fa', verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al verificar el código');
    }
  }

  async logout() {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
    }
  }
}