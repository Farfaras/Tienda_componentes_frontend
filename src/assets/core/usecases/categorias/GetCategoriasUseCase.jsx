export class GetCategoriasUseCase {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute() {
    try {
      const response = await this.categoriaRepository.getCategorias();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener las categorías'
      };
    }
  }
}