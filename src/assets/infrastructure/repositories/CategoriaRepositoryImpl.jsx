import { CategoriaRepository } from '../../core/repositories/CategoriaRepository';
import { apiClient } from '../api/axiosConfig';
import { Categoria } from '../../core/entities/Categoria';

export class CategoriaRepositoryImpl extends CategoriaRepository {
  async getCategorias() {
    try {
      const response = await apiClient.get('/categorias');
      // Ordenar por ID descendente (más reciente primero)
      const sortedData = [...response.data].sort((a, b) => b.id_categoria - a.id_categoria);
      return sortedData.map(categoria => new Categoria(categoria));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener categorías');
    }
  }

  async createCategoria(data) {
    try {
      const response = await apiClient.post('/categorias', data);
      return new Categoria(response.data.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear categoría');
    }
  }

  async updateCategoria(id, data) {
    try {
      const response = await apiClient.put(`/categorias/${id}`, data);
      return new Categoria(response.data.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar categoría');
    }
  }

  async deleteCategoria(id) {
    try {
      const response = await apiClient.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar categoría');
    }
  }
}