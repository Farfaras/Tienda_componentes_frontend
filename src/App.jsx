// src/App.jsx
import './assets/styles/general.css';
import Box from '@mui/material/Box';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Navbar } from "./assets/presentation/components/layout/Navbar";
import { DrawerHeader } from "./assets/presentation/components/styles_components/DrawerStyles";
import { PrivateRoute } from './assets/presentation/components/PrivateRoute'; 
import { ThemeProvider } from './assets/presentation/contexts/ThemeContext';
import { AuthProvider } from './assets/presentation/contexts/AuthContext';
import { UsuarioActualProvider } from './assets/presentation/contexts/UsuarioActualContext';
import SessionExpiredModal from './assets/presentation/components/Modal/SessionExpiredModal';
import { useSessionCheck } from './assets/presentation/hooks/useSessionCheck';

import { Inicio } from "./assets/presentation/pages/Inicio";
import { Usuarios } from "./assets/presentation/pages/Usuarios";
import { Clientes } from "./assets/presentation/pages/Clientes";
import { Productos } from "./assets/presentation/pages/Productos";
import { Categorias } from "./assets/presentation/pages/Categorias";
import { Marcas } from "./assets/presentation/pages/Marcas";
import { GenerarVenta } from "./assets/presentation/pages/GenerarVenta";
import { ReporteVentas } from "./assets/presentation/pages/ReporteVentas";
import { ReporteAnulados } from "./assets/presentation/pages/ReporteAnulados";
import { GenerarCotizacion } from "./assets/presentation/pages/GenerarCotizacion";
import { ReporteCotizacion } from "./assets/presentation/pages/ReporteCotizacion";
import { ReporteAnuladosCotizacion } from "./assets/presentation/pages/ReporteAnuladosCotizacion";
import { Login } from './assets/presentation/pages/Login'; 

function AppContent() {
  const location = useLocation();
  const { sessionExpired, handleRedirectToLogin } = useSessionCheck();

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {location.pathname !== "/login" && <Navbar />}
        
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: 'hidden', width: '100%' }}>
          {location.pathname !== "/login" && <DrawerHeader />}

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Inicio /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
            <Route path="/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
            <Route path="/marcas" element={<PrivateRoute><Marcas /></PrivateRoute>} />
            <Route path="/ventas/generar" element={<PrivateRoute><GenerarVenta /></PrivateRoute>} />
            <Route path="/ventas/reporte" element={<PrivateRoute><ReporteVentas /></PrivateRoute>} />
            <Route path="/ventas/anuladas" element={<PrivateRoute><ReporteAnulados /></PrivateRoute>} />
            <Route path="/cotizacion/generar" element={<PrivateRoute><GenerarCotizacion /></PrivateRoute>} />
            <Route path="/cotizacion/reporte" element={<PrivateRoute><ReporteCotizacion /></PrivateRoute>} />
            <Route path="/cotizacion/anuladas" element={<PrivateRoute><ReporteAnuladosCotizacion /></PrivateRoute>} />
          </Routes>
        </Box>
      </Box>
      
      <SessionExpiredModal
        open={sessionExpired}
        onLogin={handleRedirectToLogin}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UsuarioActualProvider>
          <AppContent />
        </UsuarioActualProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;