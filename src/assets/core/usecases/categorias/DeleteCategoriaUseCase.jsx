export class DeleteCategoriaUseCase {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de categoría requerido' };
    }

    try {
      const response = await this.categoriaRepository.deleteCategoria(id);
      return {
        success: true,
        message: response.message || 'Categoría eliminada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar la categoría'
      };
    }
  }
}