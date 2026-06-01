import React, { createContext, useState, useCallback } from 'react';
import { CotizacionRepositoryImpl } from '../../infrastructure/repositories/CotizacionRepositoryImpl';
import { CreateCotizacionUseCase } from '../../core/usecases/cotizaciones/CreateCotizacionUseCase';

export const CotizacionContext = createContext(null);

const cotizacionRepository = new CotizacionRepositoryImpl();
const createCotizacionUseCase = new CreateCotizacionUseCase(cotizacionRepository);

export function CotizacionProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCotizacion = useCallback(async (cotizacionData) => {
    setLoading(true);
    setError(null);
    const result = await createCotizacionUseCase.execute(cotizacionData);
    setLoading(false);
    return result;
  }, []);

  const value = {
    createCotizacion,
    loading,
    error
  };

  return React.createElement(CotizacionContext.Provider, { value }, children);
}