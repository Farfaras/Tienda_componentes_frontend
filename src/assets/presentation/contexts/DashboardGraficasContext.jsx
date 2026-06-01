import React, { createContext, useState, useEffect, useCallback } from 'react';
import { DashboardGraficasRepositoryImpl } from '../../infrastructure/repositories/DashboardGraficasRepositoryImpl';
import { GetVentasSemanalesUseCase } from '../../core/usecases/dashboard/GetVentasSemanalesUseCase';
import { GetVentasMensualesUseCase } from '../../core/usecases/dashboard/GetVentasMensualesUseCase';
import { GetTopProductosUseCase } from '../../core/usecases/dashboard/GetTopProductosUseCase';
import { GetEstadisticasVentasUseCase } from '../../core/usecases/dashboard/GetEstadisticasVentasUseCase';

export const DashboardGraficasContext = createContext(null);

const repository = new DashboardGraficasRepositoryImpl();
const getVentasSemanalesUseCase = new GetVentasSemanalesUseCase(repository);
const getVentasMensualesUseCase = new GetVentasMensualesUseCase(repository);
const getTopProductosUseCase = new GetTopProductosUseCase(repository);
const getEstadisticasVentasUseCase = new GetEstadisticasVentasUseCase(repository);

export function DashboardGraficasProvider({ children }) {
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [semanales, mensuales, productos, estadisticasData] = await Promise.all([
        getVentasSemanalesUseCase.execute(),
        getVentasMensualesUseCase.execute(),
        getTopProductosUseCase.execute(),
        getEstadisticasVentasUseCase.execute()
      ]);

      if (semanales.success) setVentasSemanales(semanales.data);
      if (mensuales.success) setVentasMensuales(mensuales.data);
      if (productos.success) setTopProductos(productos.data);
      if (estadisticasData.success) setEstadisticas(estadisticasData.data);
      
      if (!semanales.success || !mensuales.success || !productos.success || !estadisticasData.success) {
        setError('Error al cargar algunos datos');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = {
    ventasSemanales,
    ventasMensuales,
    topProductos,
    estadisticas,
    loading,
    error,
    reload: loadAllData
  };

  return React.createElement(DashboardGraficasContext.Provider, { value }, children);
}