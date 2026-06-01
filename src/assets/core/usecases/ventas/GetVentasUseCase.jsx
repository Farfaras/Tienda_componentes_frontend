export class GetVentasUseCase {
  constructor(ventaRepository) {
    this.ventaRepository = ventaRepository;
  }

  async execute(fechaInicio = null, fechaFin = null) {
    try {
      const response = await this.ventaRepository.getVentas(fechaInicio, fechaFin);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener las ventas'
      };
    }
  }
}