import React, { createContext, useState, useCallback } from 'react';
import { CotizacionReporteRepositoryImpl } from '../../infrastructure/repositories/CotizacionReporteRepositoryImpl';
import { GetCotizacionesUseCase } from '../../core/usecases/cotizaciones/GetCotizacionesUseCase';
import { AnularCotizacionUseCase } from '../../core/usecases/cotizaciones/AnularCotizacionUseCase';

export const CotizacionReporteContext = createContext(null);

const cotizacionRepository = new CotizacionReporteRepositoryImpl();
const getCotizacionesUseCase = new GetCotizacionesUseCase(cotizacionRepository);
const anularCotizacionUseCase = new AnularCotizacionUseCase(cotizacionRepository);

export function CotizacionReporteProvider({ children }) {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCotizaciones = useCallback(async (fechaInicio = null, fechaFin = null) => {
    console.log('📡 loadCotizaciones llamado con:', { fechaInicio, fechaFin });
    setLoading(true);
    setError(null);
    const result = await getCotizacionesUseCase.execute(fechaInicio, fechaFin);
    console.log('📡 Resultado:', result);
    if (result.success) {
      setCotizaciones(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const anularCotizacion = useCallback(async (id) => {
    const result = await anularCotizacionUseCase.execute(id);
    if (result.success) {
      await loadCotizaciones();
    }
    return result;
  }, [loadCotizaciones]);

  const value = {
    cotizaciones,
    loading,
    error,
    loadCotizaciones,
    anularCotizacion
  };

  return React.createElement(CotizacionReporteContext.Provider, { value }, children);
}