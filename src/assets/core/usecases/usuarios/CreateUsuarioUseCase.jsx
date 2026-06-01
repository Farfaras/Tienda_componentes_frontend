export class CreateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(usuarioData) {
    // Validaciones
    if (!usuarioData.nombre || usuarioData.nombre.trim() === '') {
      return { success: false, error: 'El nombre es requerido' };
    }
    if (!usuarioData.apellido || usuarioData.apellido.trim() === '') {
      return { success: false, error: 'El apellido es requerido' };
    }
    if (!usuarioData.email || usuarioData.email.trim() === '') {
      return { success: false, error: 'El email es requerido' };
    }
    if (!usuarioData.password || usuarioData.password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (usuarioData.password !== usuarioData.password_confirmation) {
      return { success: false, error: 'Las contraseñas no coinciden' };
    }

    try {
      const response = await this.usuarioRepository.createUsuario(usuarioData);
      return {
        success: true,
        data: response,
        message: response.message,
        user_id: response.user_id,
        email: response.email,
        manual_secret: response.manual_secret,
        qr_url: response.qr_url
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear el usuario'
      };
    }
  }
}