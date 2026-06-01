export class UpdateMarcaUseCase {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async execute(id, marcaData) {
    if (!id) {
      return { success: false, error: 'ID de marca requerido' };
    }

    try {
      const response = await this.marcaRepository.updateMarca(id, marcaData);
      return {
        success: true,
        data: response,
        message: 'Marca actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar la marca'
      };
    }
  }
}