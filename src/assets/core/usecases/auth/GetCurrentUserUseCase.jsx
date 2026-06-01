export class GetCurrentUserUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute() {
    try {
      const response = await this.usuarioRepository.getCurrentUser();
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener el usuario actual'
      };
    }
  }
}