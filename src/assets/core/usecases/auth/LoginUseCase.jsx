// src/core/usecases/auth/LoginUseCase.js
export class LoginUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials) {
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    try {
      const response = await this.authRepository.login(credentials);
      
      // Verificar si la respuesta indica error
      if (response.message === "Credenciales inválidas" || response.error) {
        return {
          success: false,
          error: response.message || 'Credenciales inválidas'
        };
      }
      
      return {
        success: true,
        requiresTwoFactor: response.two_factor_required || false,
        email: response.email,
        message: response.message
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }
}