export class DeleteProductoUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de producto requerido' };
    }

    try {
      const response = await this.productoRepository.deleteProducto(id);
      return {
        success: true,
        message: response.message || 'Producto eliminado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar el producto'
      };
    }
  }
}