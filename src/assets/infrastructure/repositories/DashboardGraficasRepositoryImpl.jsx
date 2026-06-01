import { DashboardGraficasRepository } from '../../core/repositories/DashboardGraficasRepository';
import { apiClient } from '../api/axiosConfig';
import { VentaSemanal } from '../../core/entities/VentaSemanal';
import { VentaMensual } from '../../core/entities/VentaMensual';
import { TopProducto } from '../../core/entities/TopProducto';
import { EstadisticasVentas } from '../../core/entities/EstadisticasVentas';

export class DashboardGraficasRepositoryImpl extends DashboardGraficasRepository {
  async getVentasSemanales() {
    try {
      const response = await apiClient.get('/ventas/semanales');
      return response.data.data.map(item => new VentaSemanal(item));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ventas semanales');
    }
  }

  async getVentasMensuales() {
    try {
      const response = await apiClient.get('/ventas/ultimos-6-meses');
      return response.data.data.map(item => new VentaMensual(item));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ventas mensuales');
    }
  }

  async getTopProductos() {
    try {
      const response = await apiClient.get('/ventas/top-productos');
      return response.data.data.productos.map(item => new TopProducto(item));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener top productos');
    }
  }

  async getEstadisticasVentas() {
    try {
      const response = await apiClient.get('/ventas/estadisticas-activas-anuladas');
      return new EstadisticasVentas(response.data.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
}