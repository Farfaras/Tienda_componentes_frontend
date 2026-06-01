import React, { createContext, useState, useEffect, useCallback } from 'react';
import { UsuarioRepositoryImpl } from '../../infrastructure/repositories/UsuarioRepositoryImpl';
import { GetUsuariosUseCase } from '../../core/usecases/usuarios/GetUsuariosUseCase';
import { CreateUsuarioUseCase } from '../../core/usecases/usuarios/CreateUsuarioUseCase';
import { UpdateUsuarioUseCase } from '../../core/usecases/usuarios/UpdateUsuarioUseCase';
import { ToggleUsuarioEstadoUseCase } from '../../core/usecases/usuarios/ToggleUsuarioEstadoUseCase';
import { Verify2FARegisterUseCase } from '../../core/usecases/usuarios/Verify2FARegisterUseCase';
import { useAuth } from '../hooks/useAuth';

export const UsuarioContext = createContext(null);

const usuarioRepository = new UsuarioRepositoryImpl();
const getUsuariosUseCase = new GetUsuariosUseCase(usuarioRepository);
const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository);
const toggleUsuarioEstadoUseCase = new ToggleUsuarioEstadoUseCase(usuarioRepository);
const verify2FARegisterUseCase = new Verify2FARegisterUseCase(usuarioRepository);

export function UsuarioProvider({ children }) {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getUsuariosUseCase.execute();
    if (result.success) {
      setUsuarios(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const createUsuario = useCallback(async (usuarioData) => {
    const result = await createUsuarioUseCase.execute(usuarioData);
    if (result.success) {
      await loadUsuarios();
    }
    return result;
  }, [loadUsuarios]);

  const updateUsuario = useCallback(async (id, usuarioData) => {
    const result = await updateUsuarioUseCase.execute(
      id, 
      usuarioData, 
      currentUser?.rol?.nombre, 
      currentUser?.id
    );
    if (result.success) {
      await loadUsuarios();
    }
    return result;
  }, [loadUsuarios, currentUser]);
  
  const toggleUsuarioEstado = useCallback(async (id, estadoActual) => {
    // 👈 Cambiar parámetro de targetUser a estadoActual
    const result = await toggleUsuarioEstadoUseCase.execute(id, estadoActual);
    if (result.success) {
      await loadUsuarios();
    }
    return result;
  }, [loadUsuarios]);

  const verify2FARegister = useCallback(async (verificationData) => {
    const result = await verify2FARegisterUseCase.execute(verificationData);
    return result;
  }, []);

  const value = {
    usuarios,
    loading,
    error,
    loadUsuarios,
    createUsuario,
    updateUsuario,
    toggleUsuarioEstado,
    verify2FARegister,
    currentUser
  };

  return React.createElement(UsuarioContext.Provider, { value }, children);
}