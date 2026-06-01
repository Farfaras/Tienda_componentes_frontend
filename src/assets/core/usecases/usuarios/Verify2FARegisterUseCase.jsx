export class Verify2FARegisterUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(verificationData) {
    if (!verificationData.email || !verificationData.code) {
      return { success: false, error: 'Email y código son requeridos' };
    }

    try {
      const response = await this.usuarioRepository.verify2FARegister(verificationData);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Código inválido'
      };
    }
  }
}