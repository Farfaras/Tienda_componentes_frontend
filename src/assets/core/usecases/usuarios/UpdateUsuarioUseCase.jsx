export class UpdateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id, usuarioData, currentUserRole, currentUserId) {
    if (!id) {
      return { success: false, error: 'ID de usuario requerido' };
    }

    // Obtener usuario actual para verificar permisos
    const currentUser = await this.usuarioRepository.getUsuarioById(id);
    
    // Verificar si es administrador (no se puede editar)
    if (currentUser.isAdmin() && currentUserId !== id) {
      return { success: false, error: 'No puedes editar otros administradores' };
    }

    try {
      const response = await this.usuarioRepository.updateUsuario(id, usuarioData);
      return {
        success: true,
        data: response,
        message: 'Usuario actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar el usuario'
      };
    }
  }
}