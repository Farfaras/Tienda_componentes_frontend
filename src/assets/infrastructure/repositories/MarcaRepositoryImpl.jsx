import { MarcaRepository } from '../../core/repositories/MarcaRepository';
import { apiClient } from '../api/axiosConfig';
import { Marca } from '../../core/entities/Marca';

export class MarcaRepositoryImpl extends MarcaRepository {
  async getMarcas() {
    try {
      const response = await apiClient.get('/marcas');
      // Ordenar por ID descendente (más reciente primero)
      const sortedData = [...response.data].sort((a, b) => b.id_marca - a.id_marca);
      return sortedData.map(marca => new Marca(marca));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener marcas');
    }
  }

  async createMarca(data) {
    try {
      const response = await apiClient.post('/marcas', data);
      return new Marca(response.data.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear marca');
    }
  }

  async updateMarca(id, data) {
    try {
      const response = await apiClient.put(`/marcas/${id}`, data);
      return new Marca(response.data.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar marca');
    }
  }

  async deleteMarca(id) {
    try {
      const response = await apiClient.delete(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar marca');
    }
  }
}