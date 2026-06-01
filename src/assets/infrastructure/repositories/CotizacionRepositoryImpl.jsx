import { CotizacionRepository } from '../../core/repositories/CotizacionRepository';
import { apiClient } from '../api/axiosConfig';
import { Cotizacion } from '../../core/entities/Cotizacion';

export class CotizacionRepositoryImpl extends CotizacionRepository {
  async createCotizacion(data) {
    try {
      const response = await apiClient.post('/cotizaciones', data);
      return new Cotizacion(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al crear la cotización');
    }
  }
}