import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Skeleton,
  Grid,
  Paper,
  Divider,
  Chip
} from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

import { useDashboard } from '../hooks/useDashboard';
import { useDashboardGraficas } from '../hooks/useDashboardGraficas';
import { DashboardProvider } from '../contexts/DashboardContext';
import { DashboardGraficasProvider } from '../contexts/DashboardGraficasContext';

const InicioContent = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { counts, loading: loadingCounts } = useDashboard();
  const { ventasSemanales, ventasMensuales, topProductos, estadisticas, loading: loadingGraficas } = useDashboardGraficas();

  const CardResumen = ({ titulo, valor, icono, color, to }) => (
    <Card
      component={to ? Link : 'div'}
      to={to}
      sx={{
        flex: 1,
        minWidth: 220,
        borderRadius: 3,
        boxShadow: 3,
        transition: '0.3s',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{titulo}</Typography>
            <Typography variant="h4" fontWeight="bold">
              {loadingCounts ? <Skeleton width={60} /> : valor}
            </Typography>
          </Box>
          <Box sx={{ bgcolor: `${color}.10`, borderRadius: '50%', p: 1.5 }}>{icono}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(value);
  };

  // Colores para modo oscuro/claro
  const axisColor = isDark ? '#E2E8F0' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipBorder = isDark ? '#475569' : '#E2E8F0';

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Cards de resumen */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        <CardResumen titulo="Usuarios" valor={counts.usuarios} icono={<PeopleIcon sx={{ fontSize: 32, color: '#3B82F6' }} />} color="primary" to="/usuarios" />
        <CardResumen titulo="Clientes" valor={counts.clientes} icono={<PersonIcon sx={{ fontSize: 32, color: '#22C55E' }} />} color="success" to="/clientes" />
        <CardResumen titulo="Ventas" valor={counts.ventas} icono={<ShoppingCartIcon sx={{ fontSize: 32, color: '#F59E0B' }} />} color="warning" to="/ventas/reporte" />
        <CardResumen titulo="Cotizaciones" valor={counts.cotizaciones} icono={<DescriptionIcon sx={{ fontSize: 32, color: '#A855F7' }} />} color="secondary" to="/cotizacion/reporte" />
      </Box>

      {/* Gráficas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 4,
          mt: 2
        }}
      >

        {/* Ventas Semanales */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Ventas Semanales
            </Typography>

            {loadingGraficas ? (
              <Skeleton variant="rounded" height={420} />
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={ventasSemanales}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="dia" stroke={axisColor} tick={{ fill: axisColor }} />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: 8,
                      color: axisColor
                    }}
                  />
                  <Legend wrapperStyle={{ color: axisColor }} />
                  <Bar
                    dataKey="totalVentas"
                    name="Total Ventas (Bs)"
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Ventas Mensuales */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Ventas Últimos 6 Meses
            </Typography>

            {loadingGraficas ? (
              <Skeleton variant="rounded" height={420} />
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="mes" stroke={axisColor} tick={{ fill: axisColor }} />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: 8,
                      color: axisColor
                    }}
                  />
                  <Legend wrapperStyle={{ color: axisColor }} />
                  <Line
                    type="monotone"
                    dataKey="totalVentas"
                    name="Total Ventas (Bs)"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Productos */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Top 5 Productos Más Vendidos
            </Typography>

            {loadingGraficas ? (
              <Skeleton variant="rounded" height={420} />
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={topProductos}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" stroke={axisColor} tick={{ fill: axisColor }} />
                  <YAxis 
                    type="category" 
                    dataKey="nombre" 
                    width={120}
                    stroke={axisColor}
                    tick={{ fill: axisColor, fontSize: 16 }}
                  />
                  <Tooltip 
                    formatter={(value) => `${value} unidades`}
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      borderRadius: 8,
                      color: axisColor
                    }}
                  />
                  <Legend wrapperStyle={{ color: axisColor }} />
                  <Bar
                    dataKey="totalUnidades"
                    name="Unidades Vendidas"
                    fill="#F59E0B"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Ventas Activas vs Anuladas
            </Typography>

            {loadingGraficas ? (
              <Skeleton variant="rounded" height={420} />
            ) : estadisticas ? (
              <Box
                sx={{
                  height: 420,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Paper
                    sx={{
                      flex: 1,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: '#10B98110',
                      borderRadius: 3
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">Activas</Typography>
                    <Typography variant="h2" fontWeight="bold" color="#10B981">
                      {estadisticas.cantidad.activas}
                    </Typography>
                    <Chip
                      label={`${estadisticas.cantidad.porcentajeActivas}%`}
                      sx={{ mt: 2, bgcolor: '#10B98120', color: '#10B981' }}
                    />
                  </Paper>

                  <Paper
                    sx={{
                      flex: 1,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: '#EF444410',
                      borderRadius: 3
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">Anuladas</Typography>
                    <Typography variant="h2" fontWeight="bold" color="#EF4444">
                      {estadisticas.cantidad.anuladas}
                    </Typography>
                    <Chip
                      label={`${estadisticas.cantidad.porcentajeAnuladas}%`}
                      sx={{ mt: 2, bgcolor: '#EF444420', color: '#EF4444' }}
                    />
                  </Paper>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary">Tasa de Anulación</Typography>
                    <Typography variant="h5" fontWeight="bold" color={axisColor}>
                      {estadisticas.metricas.tasa_anulacion}%
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography color="text.secondary">Ingreso Promedio</Typography>
                    <Typography variant="h5" fontWeight="bold" color={axisColor}>
                      {formatCurrency(estadisticas.metricas.ingreso_promedio_activo)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export const Inicio = () => {
  return (
    <DashboardProvider>
      <DashboardGraficasProvider>
        <InicioContent />
      </DashboardGraficasProvider>
    </DashboardProvider>
  );
};