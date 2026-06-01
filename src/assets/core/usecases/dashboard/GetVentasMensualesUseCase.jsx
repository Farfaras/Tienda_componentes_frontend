export class GetVentasMensualesUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    try {
      const response = await this.repository.getVentasMensuales();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener ventas mensuales'
      };
    }
  }
}