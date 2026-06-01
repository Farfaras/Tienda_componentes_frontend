export class UpdateClienteUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(id, clienteData) {
    if (!id) {
      return { success: false, error: 'ID de cliente requerido' };
    }

    try {
      const response = await this.clienteRepository.updateCliente(id, clienteData);
      return {
        success: true,
        data: response,
        message: 'Cliente actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar el cliente'
      };
    }
  }
}