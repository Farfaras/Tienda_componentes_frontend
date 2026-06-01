import { DashboardRepository } from '../../core/repositories/DashboardRepository';
import { apiClient } from '../api/axiosConfig';
import { DashboardCount } from '../../core/entities/DashboardCount';

export class DashboardRepositoryImpl extends DashboardRepository {
  async getUsuariosCount() {
    try {
      const response = await apiClient.get('/usuarios/activos/count');
      return new DashboardCount(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener conteo de usuarios');
    }
  }

  async getClientesCount() {
    try {
      const response = await apiClient.get('/clientes/activos/count');
      return new DashboardCount(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener conteo de clientes');
    }
  }

  async getVentasCount() {
    try {
      const response = await apiClient.get('/ventas/activas/count');
      return new DashboardCount(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener conteo de ventas');
    }
  }

  async getCotizacionesCount() {
    try {
      const response = await apiClient.get('/cotizaciones/activas/count');
      return new DashboardCount(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener conteo de cotizaciones');
    }
  }
}