import { CotizacionReporteRepository } from '../../core/repositories/CotizacionReporteRepository';
import { apiClient } from '../api/axiosConfig';
import { CotizacionReporte } from '../../core/entities/CotizacionReporte';

export class CotizacionReporteRepositoryImpl extends CotizacionReporteRepository {
  async getCotizaciones(fechaInicio, fechaFin) {
    try {
      const response = await apiClient.get('/cotizaciones');
      
      // Filtrar solo cotizaciones activas (estado = true)
      let cotizacionesActivas = response.data.filter(c => c.estado === true);
      
      // Filtrar por fechas en el frontend (hasta que el backend lo soporte)
      if (fechaInicio) {
        const fechaInicioObj = new Date(fechaInicio);
        fechaInicioObj.setHours(0, 0, 0, 0);
        cotizacionesActivas = cotizacionesActivas.filter(c => {
          const fechaCotizacion = new Date(c.fecha);
          return fechaCotizacion >= fechaInicioObj;
        });
      }
      
      if (fechaFin) {
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setHours(23, 59, 59, 999);
        cotizacionesActivas = cotizacionesActivas.filter(c => {
          const fechaCotizacion = new Date(c.fecha);
          return fechaCotizacion <= fechaFinObj;
        });
      }
      
      const sortedData = [...cotizacionesActivas].sort((a, b) => b.id_documento - a.id_documento);
      return sortedData.map(cotizacion => new CotizacionReporte(cotizacion));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cotizaciones');
    }
  }

  async anularCotizacion(id) {
    try {
      const response = await apiClient.delete(`/cotizaciones/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al anular la cotización');
    }
  }
}