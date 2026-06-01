import { UsuarioRepository } from '../../core/repositories/UsuarioRepository';
import { apiClient } from '../api/axiosConfig';
import { Usuario } from '../../core/entities/Usuario';

export class UsuarioRepositoryImpl extends UsuarioRepository {
  async getUsuarios() {
    try {
      const response = await apiClient.get('/usuarios');
      const sortedData = [...response.data].sort((a, b) => b.id_usuario - a.id_usuario);
      return sortedData.map(usuario => new Usuario(usuario));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  }

  async getUsuarioById(id) {
    try {
      const response = await apiClient.get(`/usuarios/${id}`);
      return new Usuario(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  }

  async createUsuario(data) {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  }

  async updateUsuario(id, data) {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, data);
      return new Usuario(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }

  async toggleUsuarioEstado(id, estado) {
    try {
      console.log('📤 Enviando petición PATCH a:', `/usuarios/${id}/estado`);
      console.log('📦 Datos enviados:', { estado });
      
      const response = await apiClient.patch(`/usuarios/${id}/estado`, {
        estado: estado === 1 || estado === true  // Convertir a booleano
      });
      
      console.log('✅ Respuesta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado');
    }
  }

  async verify2FARegister(data) {
    try {
      const response = await apiClient.post('/auth/register/verify-2fa', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Código inválido');
    }
  }
}