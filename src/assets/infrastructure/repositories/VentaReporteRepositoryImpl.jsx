import { VentaReporteRepository } from '../../core/repositories/VentaReporteRepository';
import { apiClient } from '../api/axiosConfig';
import { VentaReporte } from '../../core/entities/VentaReporte';

export class VentaReporteRepositoryImpl extends VentaReporteRepository {
  async getVentas(fechaInicio, fechaFin) {
    try {
      const response = await apiClient.get('/ventas');
      
      // Filtrar solo ventas activas (estado = true)
      let ventasActivas = response.data.filter(v => v.estado === true);
      
      // Filtrar por fechas en el frontend
      if (fechaInicio) {
        const fechaInicioObj = new Date(fechaInicio);
        fechaInicioObj.setHours(0, 0, 0, 0);
        ventasActivas = ventasActivas.filter(v => {
          const fechaVenta = new Date(v.fecha);
          return fechaVenta >= fechaInicioObj;
        });
      }
      
      if (fechaFin) {
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setHours(23, 59, 59, 999);
        ventasActivas = ventasActivas.filter(v => {
          const fechaVenta = new Date(v.fecha);
          return fechaVenta <= fechaFinObj;
        });
      }
      
      const sortedData = [...ventasActivas].sort((a, b) => b.id_documento - a.id_documento);
      return sortedData.map(venta => new VentaReporte(venta));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener ventas');
    }
  }

  async anularVenta(id) {
    try {
      const response = await apiClient.delete(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al anular la venta');
    }
  }
}