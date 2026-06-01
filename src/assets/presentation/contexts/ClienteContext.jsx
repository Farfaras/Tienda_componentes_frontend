import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ClienteRepositoryImpl } from '../../infrastructure/repositories/ClienteRepositoryImpl';
import { GetClientesUseCase } from '../../core/usecases/clientes/GetClientesUseCase';
import { CreateClienteUseCase } from '../../core/usecases/clientes/CreateClienteUseCase';
import { UpdateClienteUseCase } from '../../core/usecases/clientes/UpdateClienteUseCase';
import { DeleteClienteUseCase } from '../../core/usecases/clientes/DeleteClienteUseCase';

export const ClienteContext = createContext(null);

const clienteRepository = new ClienteRepositoryImpl();
const getClientesUseCase = new GetClientesUseCase(clienteRepository);
const createClienteUseCase = new CreateClienteUseCase(clienteRepository);
const updateClienteUseCase = new UpdateClienteUseCase(clienteRepository);
const deleteClienteUseCase = new DeleteClienteUseCase(clienteRepository);

export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes
  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getClientesUseCase.execute();
    if (result.success) {
      setClientes(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Crear cliente
  const createCliente = useCallback(async (clienteData) => {
    const result = await createClienteUseCase.execute(clienteData);
    if (result.success) {
      await loadClientes(); // Recargar la lista
    }
    return result;
  }, [loadClientes]);

  // Actualizar cliente
  const updateCliente = useCallback(async (id, clienteData) => {
    const result = await updateClienteUseCase.execute(id, clienteData);
    if (result.success) {
      await loadClientes(); // Recargar la lista
    }
    return result;
  }, [loadClientes]);

  // Eliminar cliente
  const deleteCliente = useCallback(async (id) => {
    const result = await deleteClienteUseCase.execute(id);
    if (result.success) {
      await loadClientes(); // Recargar la lista
    }
    return result;
  }, [loadClientes]);

  const value = {
    clientes,
    loading,
    error,
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente
  };

  return React.createElement(ClienteContext.Provider, { value }, children);
}