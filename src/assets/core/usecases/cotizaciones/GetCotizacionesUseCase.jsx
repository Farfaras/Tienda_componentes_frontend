export class GetCotizacionesUseCase {
  constructor(cotizacionRepository) {
    this.cotizacionRepository = cotizacionRepository;
  }

  async execute(fechaInicio = null, fechaFin = null) {
    try {
      const response = await this.cotizacionRepository.getCotizaciones(fechaInicio, fechaFin);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener las cotizaciones'
      };
    }
  }
}