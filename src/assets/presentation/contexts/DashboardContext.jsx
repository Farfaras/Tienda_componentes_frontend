import React, { createContext, useState, useEffect, useCallback } from 'react';
import { DashboardRepositoryImpl } from '../../infrastructure/repositories/DashboardRepositoryImpl';
import { GetDashboardCountsUseCase } from '../../core/usecases/dashboard/GetDashboardCountsUseCase';

export const DashboardContext = createContext(null);

const dashboardRepository = new DashboardRepositoryImpl();
const getDashboardCountsUseCase = new GetDashboardCountsUseCase(dashboardRepository);

export function DashboardProvider({ children }) {
  const [counts, setCounts] = useState({
    usuarios: 0,
    clientes: 0,
    ventas: 0,
    cotizaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getDashboardCountsUseCase.execute();
    if (result.success) {
      setCounts(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const value = {
    counts,
    loading,
    error,
    loadCounts
  };

  return React.createElement(DashboardContext.Provider, { value }, children);
}