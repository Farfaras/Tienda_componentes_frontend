export class ToggleUsuarioEstadoUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id, estadoActual) {  // 👈 Cambiar targetUser por estadoActual
    if (!id) {
      return { success: false, error: 'ID de usuario requerido' };
    }

    try {
      console.log('🔄 ToggleUsuarioEstadoUseCase:');
      console.log('   - ID:', id);
      console.log('   - Estado actual:', estadoActual);
      
      // Enviar el estado como número (1 = true, 0 = false)
      const estadoEnvio = estadoActual === true ? 1 : 0;
      
      await this.usuarioRepository.toggleUsuarioEstado(id, estadoEnvio);
      
      const nuevoEstado = !estadoActual;
      
      return {
        success: true,
        message: nuevoEstado ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente',
        estado: nuevoEstado
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al cambiar el estado del usuario'
      };
    }
  }
}