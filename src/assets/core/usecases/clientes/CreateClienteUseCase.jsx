export class CreateClienteUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(clienteData) {
    // Validaciones
    if (!clienteData.ci) {
      return { success: false, error: 'El CI es requerido' };
    }
    if (!clienteData.nombre) {
      return { success: false, error: 'El nombre es requerido' };
    }
    if (!clienteData.apellido) {
      return { success: false, error: 'El apellido es requerido' };
    }
    if (!clienteData.telefono) {
      return { success: false, error: 'El teléfono es requerido' };
    }

    try {
      const response = await this.clienteRepository.createCliente(clienteData);
      return {
        success: true,
        data: response,
        message: 'Cliente creado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear el cliente'
      };
    }
  }
}