import { ClienteRepository } from '../../core/repositories/ClienteRepository';
import { apiClient } from '../api/axiosConfig';
import { Cliente } from '../../core/entities/Cliente';

export class ClienteRepositoryImpl extends ClienteRepository {
  async getClientes() {
    try {
      const response = await apiClient.get('/clientes');
      return response.data.map(cliente => new Cliente(cliente));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener clientes');
    }
  }

  async createCliente(data) {
    try {
      const response = await apiClient.post('/clientes', data);
      return new Cliente(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al crear cliente');
    }
  }

  async updateCliente(id, data) {
    try {
      const response = await apiClient.put(`/clientes/${id}`, data);
      return new Cliente(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar cliente');
    }
  }

  async deleteCliente(id) {
    try {
      const response = await apiClient.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar cliente');
    }
  }
}