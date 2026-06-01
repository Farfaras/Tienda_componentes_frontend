import { UsuarioActualRepository } from '../../core/repositories/UsuarioActualRepository';
import { apiClient } from '../api/axiosConfig';
import { UsuarioActual } from '../../core/entities/UsuarioActual';

export class UsuarioActualRepositoryImpl extends UsuarioActualRepository {
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return new UsuarioActual(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario actual');
    }
  }
}