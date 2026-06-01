export class CreateMarcaUseCase {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async execute(marcaData) {
    // Validaciones
    if (!marcaData.nombre || marcaData.nombre.trim() === '') {
      return { success: false, error: 'El nombre es requerido' };
    }

    try {
      const response = await this.marcaRepository.createMarca(marcaData);
      return {
        success: true,
        data: response,
        message: 'Marca creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear la marca'
      };
    }
  }
}