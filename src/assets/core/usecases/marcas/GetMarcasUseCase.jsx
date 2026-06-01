export class GetMarcasUseCase {
  constructor(marcaRepository) {
    this.marcaRepository = marcaRepository;
  }

  async execute() {
    try {
      const response = await this.marcaRepository.getMarcas();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener las marcas'
      };
    }
  }
}