export class EstadisticasVentas {
  constructor({ cantidad, monto, metricas }) {
    this.cantidad = {
      activas: cantidad.activas,
      anuladas: cantidad.anuladas,
      total: cantidad.total,
      porcentajeActivas: cantidad.porcentaje_activas,
      porcentajeAnuladas: cantidad.porcentaje_anuladas
    };
    this.monto = {
      activas: monto.activas,
      anuladas: monto.anuladas,
      total: monto.total,
      porcentajeActivas: monto.porcentaje_activas,
      porcentajeAnuladas: monto.porcentaje_anuladas
    };
    this.metricas = metricas;
  }
}