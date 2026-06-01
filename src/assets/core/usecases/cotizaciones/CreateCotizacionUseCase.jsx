export class CreateCotizacionUseCase {
  constructor(cotizacionRepository) {
    this.cotizacionRepository = cotizacionRepository;
  }

  async execute(cotizacionData) {
    // Validaciones
    if (!cotizacionData.id_cliente) {
      return { success: false, error: 'El cliente es requerido' };
    }
    if (!cotizacionData.id_usuario) {
      return { success: false, error: 'El usuario es requerido' };
    }
    if (!cotizacionData.detalles || cotizacionData.detalles.length === 0) {
      return { success: false, error: 'Se requiere al menos un producto' };
    }

    try {
      const response = await this.cotizacionRepository.createCotizacion(cotizacionData);
      return {
        success: true,
        data: response,
        message: 'Cotización creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear la cotización'
      };
    }
  }
}