import { useContext } from 'react';
import { DashboardGraficasContext } from '../contexts/DashboardGraficasContext';

export const useDashboardGraficas = () => {
  const context = useContext(DashboardGraficasContext);
  
  if (!context) {
    throw new Error('useDashboardGraficas must be used within DashboardGraficasProvider');
  }
  
  return context;
};