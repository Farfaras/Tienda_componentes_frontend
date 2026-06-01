export class DeleteClienteUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(id) {
    if (!id) {
      return { success: false, error: 'ID de cliente requerido' };
    }

    try {
      const response = await this.clienteRepository.deleteCliente(id);
      return {
        success: true,
        message: response.message || 'Cliente eliminado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar el cliente'
      };
    }
  }
}