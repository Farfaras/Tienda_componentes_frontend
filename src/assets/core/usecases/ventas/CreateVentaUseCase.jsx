export class CreateVentaUseCase {
  constructor(ventaRepository) {
    this.ventaRepository = ventaRepository;
  }

  async execute(ventaData) {
    if (!ventaData.id_cliente) {
      return { success: false, error: 'El cliente es requerido' };
    }
    if (!ventaData.id_usuario) {
      return { success: false, error: 'El usuario es requerido' };
    }
    if (!ventaData.detalles || ventaData.detalles.length === 0) {
      return { success: false, error: 'Se requiere al menos un producto' };
    }

    try {
      const response = await this.ventaRepository.createVenta(ventaData);
      return {
        success: true,
        data: response,
        message: 'Venta creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear la venta'
      };
    }
  }
}