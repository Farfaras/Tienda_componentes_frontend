export class GetClientesUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute() {
    try {
      const response = await this.clienteRepository.getClientes();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener los clientes'
      };
    }
  }
}