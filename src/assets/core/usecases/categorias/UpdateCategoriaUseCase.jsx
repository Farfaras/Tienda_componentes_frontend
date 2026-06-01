export class UpdateCategoriaUseCase {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute(id, categoriaData) {
    if (!id) {
      return { success: false, error: 'ID de categoría requerido' };
    }

    try {
      const response = await this.categoriaRepository.updateCategoria(id, categoriaData);
      return {
        success: true,
        data: response,
        message: 'Categoría actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar la categoría'
      };
    }
  }
}