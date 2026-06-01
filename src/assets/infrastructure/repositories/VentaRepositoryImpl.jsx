import { VentaRepository } from '../../core/repositories/VentaRepository';
import { apiClient } from '../api/axiosConfig';
import { Venta } from '../../core/entities/Venta';

export class VentaRepositoryImpl extends VentaRepository {
  async createVenta(data) {
    try {
      const response = await apiClient.post('/ventas', data);
      return new Venta(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al crear la venta');
    }
  }
}