export class GetProductosUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute() {
    try {
      const response = await this.productoRepository.getProductos();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener los productos'
      };
    }
  }
}