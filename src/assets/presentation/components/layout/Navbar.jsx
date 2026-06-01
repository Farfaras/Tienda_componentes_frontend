import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';   
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { useAuth } from '../../hooks/useAuth';
import { useUsuarioActual } from '../../hooks/useUsuarioActual';
import { ModalLogout } from '../Modal/ModalLogout';
import { MenuItems } from '../data/MenuItems';
import { AppBar, DrawerHeader } from '../styles_components/DrawerStyles';
import { SearchBar } from './SearchBar';
import { SidebarMenu } from './SidebarMenu';

export const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { usuario } = useUsuarioActual();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [openMenus, setOpenMenus] = React.useState({ ventas: false, cotizacion: false });
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const [anchorElVentas, setAnchorElVentas] = React.useState(null);
  const [anchorElCotizacion, setAnchorElCotizacion] = React.useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const getUserInitials = () => {
    if (!usuario) return '';
    const nombre = usuario.nombre || '';
    const apellido = usuario.apellido || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const userInitials = getUserInitials();
  const userName = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario';
  const userEmail = usuario?.email || '';

  const handleOpenLogoutModal = () => {
    setAnchorElUser(null);
    setLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) setMobileOpen(false);
  };

  const desktopDrawer = (
    <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, width: open ? 260 : 73, flexShrink: 0, '& .MuiDrawer-paper': { width: open ? 260 : 73, boxSizing: 'border-box', transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }), overflowX: 'hidden', backgroundColor: theme.palette.background.default, borderRight: `1px solid ${theme.palette.divider}` } }}>
      <DrawerHeader sx={{ backgroundColor: theme.palette.mode === 'light' ? '#3B82F6' : '#323c4d' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', opacity: open ? 1 : 0, transition: 'opacity 0.2s', color: '#fff' }}>ComputerCity</Typography>
        <IconButton onClick={() => setOpen(false)} sx={{ ml: open ? 0 : 'auto', mr: open ? 0 : 'auto', color: '#fff' }}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </DrawerHeader>
      <Divider />
      <SidebarMenu items={MenuItems} open={open} openMenus={openMenus} setOpenMenus={setOpenMenus} anchorElVentas={anchorElVentas} anchorElCotizacion={anchorElCotizacion} setAnchorElVentas={setAnchorElVentas} setAnchorElCotizacion={setAnchorElCotizacion} setMobileOpen={setMobileOpen} isMobile={false} />
    </Drawer>
  );

  const mobileDrawer = (
    <Drawer variant="temporary" anchor="left" open={mobileOpen} onClose={handleDrawerClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', backgroundColor: theme.palette.background.default } }}>
      <DrawerHeader><Typography variant="h6" sx={{ fontWeight: 'bold' }}>ComputerCity</Typography><IconButton onClick={handleDrawerClose}><ChevronLeftIcon /></IconButton></DrawerHeader>
      <Divider />
      <SidebarMenu items={MenuItems} open={true} openMenus={openMenus} setOpenMenus={setOpenMenus} anchorElVentas={anchorElVentas} anchorElCotizacion={anchorElCotizacion} setAnchorElVentas={setAnchorElVentas} setAnchorElCotizacion={setAnchorElCotizacion} setMobileOpen={setMobileOpen} isMobile={true} />
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open && !isMobile}>
        <Toolbar>
          <IconButton color="inherit" aria-label="abrir menú" onClick={handleDrawerToggle} edge="start" sx={{ marginRight: 2, ...((open && !isMobile) && { display: 'none' }) }}><MenuIcon /></IconButton>
          
          {/* SearchBar - se mantiene en su posición original */}
          <SearchBar items={MenuItems} />
          
          {/* Título centrado - Solo visible en desktop, ocupa el espacio restante */}
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 'bold',
              letterSpacing: 1,
              display: { xs: 'none', md: 'block' }
            }}
          >
            Módulo de Ventas
          </Typography>
          
          {/* Espaciador para desktop cuando el título está visible */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
          
          <Typography variant="body2" sx={{ mr: 2, color: 'white', display: { xs: 'none', sm: 'block' } }}>{userName}</Typography>
          
          <IconButton size="large" color="inherit" onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5 }}>
            {userInitials ? (
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', lineHeight: 1, border: '2px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', transition: 'all 0.2s ease' }}>{userInitials}</div>
            ) : (
              <AccountCircle sx={{ border: '1px solid white', borderRadius: '50%', fontSize: 32 }} />
            )}
          </IconButton>
          
          <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem disabled sx={{ opacity: 1 }}><div><Typography variant="body2" fontWeight="bold">{userName}</Typography><Typography variant="caption" color="textSecondary">{userEmail}</Typography></div></MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenLogoutModal}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {mobileDrawer}
      {desktopDrawer}
      <ModalLogout open={logoutModalOpen} onClose={handleCloseLogoutModal} onConfirm={handleConfirmLogout} loading={logoutLoading} />
    </Box>
  );
};