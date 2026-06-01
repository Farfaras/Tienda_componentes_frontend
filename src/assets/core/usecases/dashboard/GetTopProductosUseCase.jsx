export class GetTopProductosUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    try {
      const response = await this.repository.getTopProductos();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener top productos'
      };
    }
  }
}