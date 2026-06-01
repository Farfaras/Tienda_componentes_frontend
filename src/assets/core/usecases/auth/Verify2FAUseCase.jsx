// src/core/usecases/auth/Verify2FAUseCase.js
import { User } from '../../entities/User';

export class Verify2FAUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(verificationData) {
    if (!verificationData.email || !verificationData.code) {
      throw new Error('Email y código son requeridos');
    }

    try {
      const response = await this.authRepository.verify2FA(verificationData);
      
      const user = new User(response.user);
      
      // ✅ Solo guardar token, NO guardar usuario
      localStorage.setItem('token', response.token);
      
      return {
        success: true,
        token: response.token,
        user: user,
        expiresIn: response.expires_in_minutes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al verificar el código'
      };
    }
  }
}