import React, { createContext, useState, useCallback } from 'react';
import { VentaReporteRepositoryImpl } from '../../infrastructure/repositories/VentaReporteRepositoryImpl';
import { GetVentasUseCase } from '../../core/usecases/ventas/GetVentasUseCase';
import { AnularVentaUseCase } from '../../core/usecases/ventas/AnularVentaUseCase';

export const VentaReporteContext = createContext(null);

const ventaRepository = new VentaReporteRepositoryImpl();
const getVentasUseCase = new GetVentasUseCase(ventaRepository);
const anularVentaUseCase = new AnularVentaUseCase(ventaRepository);

export function VentaReporteProvider({ children }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVentas = useCallback(async (fechaInicio = null, fechaFin = null) => {
    setLoading(true);
    setError(null);
    const result = await getVentasUseCase.execute(fechaInicio, fechaFin);
    if (result.success) {
      setVentas(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  const anularVenta = useCallback(async (id) => {
    const result = await anularVentaUseCase.execute(id);
    if (result.success) {
      await loadVentas();
    }
    return result;
  }, [loadVentas]);

  const value = {
    ventas,
    loading,
    error,
    loadVentas,
    anularVenta
  };

  return React.createElement(VentaReporteContext.Provider, { value }, children);
}