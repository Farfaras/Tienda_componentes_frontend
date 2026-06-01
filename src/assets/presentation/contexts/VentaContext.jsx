import React, { createContext, useState, useCallback } from 'react';
import { VentaRepositoryImpl } from '../../infrastructure/repositories/VentaRepositoryImpl';
import { CreateVentaUseCase } from '../../core/usecases/ventas/CreateVentaUseCase';

export const VentaContext = createContext(null);

const ventaRepository = new VentaRepositoryImpl();
const createVentaUseCase = new CreateVentaUseCase(ventaRepository);

export function VentaProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createVenta = useCallback(async (ventaData) => {
    setLoading(true);
    setError(null);
    const result = await createVentaUseCase.execute(ventaData);
    setLoading(false);
    return result;
  }, []);

  const value = {
    createVenta,
    loading,
    error
  };

  return React.createElement(VentaContext.Provider, { value }, children);
}