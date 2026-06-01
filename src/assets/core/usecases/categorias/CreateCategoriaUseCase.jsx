export class CreateCategoriaUseCase {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute(categoriaData) {
    // Validaciones
    if (!categoriaData.nombre || categoriaData.nombre.trim() === '') {
      return { success: false, error: 'El nombre es requerido' };
    }

    try {
      const response = await this.categoriaRepository.createCategoria(categoriaData);
      return {
        success: true,
        data: response,
        message: 'Categoría creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear la categoría'
      };
    }
  }
}