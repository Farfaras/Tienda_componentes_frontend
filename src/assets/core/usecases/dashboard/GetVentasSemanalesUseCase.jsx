export class GetVentasSemanalesUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    try {
      const response = await this.repository.getVentasSemanales();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener ventas semanales'
      };
    }
  }
}