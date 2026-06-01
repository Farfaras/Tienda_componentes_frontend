export class DeleteMarcaUseCase {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de marca requerido' };
    }

    try {
      const response = await this.marcaRepository.deleteMarca(id);
      return {
        success: true,
        message: response.message || 'Marca eliminada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar la marca'
      };
    }
  }
}