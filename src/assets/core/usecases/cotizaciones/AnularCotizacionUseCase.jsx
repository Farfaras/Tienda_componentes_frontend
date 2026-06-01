export class AnularCotizacionUseCase {
  constructor(cotizacionRepository) {
    this.cotizacionRepository = cotizacionRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de cotización requerido' };
    }

    try {
      const response = await this.cotizacionRepository.anularCotizacion(id);
      return {
        success: true,
        message: response.message || 'Cotización anulada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al anular la cotización'
      };
    }
  }
}