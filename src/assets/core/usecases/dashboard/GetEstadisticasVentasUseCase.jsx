export class GetEstadisticasVentasUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    try {
      const response = await this.repository.getEstadisticasVentas();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener estadísticas de ventas'
      };
    }
  }
}