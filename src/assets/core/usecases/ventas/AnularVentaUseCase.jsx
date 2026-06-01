export class AnularVentaUseCase {
  constructor(ventaRepository) {
    this.ventaRepository = ventaRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de venta requerido' };
    }

    try {
      const response = await this.ventaRepository.anularVenta(id);
      return {
        success: true,
        message: response.message || 'Venta anulada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al anular la venta'
      };
    }
  }
}