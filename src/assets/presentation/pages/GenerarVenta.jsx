import React, { useState } from 'react';
import { Alert, alpha, Autocomplete, Badge, Box, Button, Card, CardContent, CardMedia, Chip, Container, CircularProgress, Divider, Fade, Grid, IconButton, InputAdornment, Paper, Slide, Snackbar, Stack, TextField, Typography, useTheme, Zoom } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useProductos } from '../hooks/useProductos';
import { useClientes } from '../hooks/useClientes';
import { useVentas } from '../hooks/useVentas';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import { PDFViewerModal } from '../components/Modal/PDFViewerModal';
import { Preloader } from '../components/Preloader';
import { ProductoProvider } from '../contexts/ProductoContext';
import { ClienteProvider } from '../contexts/ClienteContext';
import { VentaProvider } from '../contexts/VentaContext';
import { UsuarioActualProvider } from '../contexts/UsuarioActualContext';

const GenerarVentaContent = () => {
  const theme = useTheme();
  const { productos, loading: loadingProductos, loadProductos } = useProductos();
  const { clientes, loading: loadingClientes } = useClientes();
  const { createVenta, loading: savingVenta } = useVentas();
  const { userId, loading: loadingUsuario } = useUsuarioActual();

  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [ventaError, setVentaError] = useState('');
  const [pdfData, setPdfData] = useState(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'warning' });

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showSnackbar = (message, severity = 'warning') => setSnackbar({ open: true, message, severity });

  const addToCart = (producto) => {
    if (producto.stock === 0) {
      showSnackbar(`No hay stock de "${producto.nombre}"`, 'error');
      return;
    }
    const existingItem = cartItems.find(item => item.id === producto.id);
    const currentQuantity = existingItem?.cantidad || 0;
    if (currentQuantity + 1 > producto.stock) {
      showSnackbar(`Stock insuficiente. Solo quedan ${producto.stock} unidades`, 'error');
      return;
    }
    if (existingItem) {
      setCartItems(cartItems.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCartItems([...cartItems, { id: producto.id, nombre: producto.nombre, modelo: producto.modelo, precio: producto.precio, cantidad: 1, descuento: 0, imagenUrl: producto.imagenUrl, stock: producto.stock }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    if (newQuantity > item.stock) {
      showSnackbar(`Stock máximo: ${item.stock} unidades`, 'error');
      return;
    }
    if (newQuantity < 1) return removeItem(id);
    setCartItems(cartItems.map(item => item.id === id ? { ...item, cantidad: newQuantity } : item));
  };

  const updateDiscount = (id, discountAmount) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    let newDiscount = parseFloat(discountAmount);
    if (isNaN(newDiscount)) newDiscount = 0;
    if (newDiscount < 0) newDiscount = 0;
    const maxDiscount = item.precio * item.cantidad;
    if (newDiscount > maxDiscount) newDiscount = maxDiscount;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, descuento: newDiscount } : item));
  };

  const removeItem = (id) => setCartItems(cartItems.filter(item => item.id !== id));

  const calculateSubtotal = () => cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const calculateTotalDiscount = () => cartItems.reduce((total, item) => total + item.descuento, 0);
  const calculateTotal = () => calculateSubtotal() - calculateTotalDiscount();

  const formatPrice = (price) => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(price);
  const formatDate = (date) => new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  const clearCart = () => setCartItems([]);

  const handleGenerateSale = async () => {
    if (cartItems.length === 0) return setVentaError('Agregue productos a la venta');
    if (!selectedCliente) return setVentaError('Seleccione un cliente');

    const detalles = cartItems.map(item => ({ id_producto: item.id, cantidad: item.cantidad, precio_unitario: parseFloat(item.precio), descuento: parseFloat(item.descuento) }));
    const result = await createVenta({ fecha: formatDate(new Date()), id_cliente: parseInt(selectedCliente), id_usuario: userId, detalles });
    
    if (result.success) {
      await loadProductos(); // 👈 Recargar productos para actualizar stock
      setPdfData(result.data);
      setOpenPDF(true);
      clearCart();
      setSelectedCliente('');
      setVentaError('');
    } else {
      setVentaError(result.error);
    }
  };

  const loading = loadingProductos || loadingClientes || loadingUsuario;
  if (loading) return <Preloader message="Cargando..." fullScreen={false} />;

  return (
    <>
      <Box sx={{ minHeight: '100vh' }}>
        <Container maxWidth={false} disableGutters sx={{ py: 3, px: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Slide direction="right" in timeout={500}>
                <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', position: 'sticky', top: 20, bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF' }}>
                  <Box sx={{ p: 2, bgcolor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCartIcon /><Typography variant="h6" fontWeight="bold">Venta</Typography></Box>
                    <Badge badgeContent={cartItems.length} color="error"><ReceiptLongIcon /></Badge>
                  </Box>

                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Autocomplete fullWidth size="small" options={clientes} getOptionLabel={(option) => `${option.nombreCompleto} - CI: ${option.ci}`} isOptionEqualToValue={(option, value) => option.id === value?.id} value={clientes.find(c => c.id === selectedCliente) || null} onChange={(event, newValue) => setSelectedCliente(newValue ? newValue.id : '')} renderInput={(params) => <TextField {...params} label="Buscar cliente" placeholder="Escriba nombre, apellido o CI..." variant="outlined" />} renderOption={(props, option) => (<li {...props}><Box><Typography variant="body2" fontWeight="bold">{option.nombreCompleto}</Typography><Typography variant="caption" color="text.secondary">CI: {option.ci} | Tel: {option.telefono}</Typography></Box></li>)} filterOptions={(options, { inputValue }) => { const sv = inputValue.toLowerCase(); return options.filter(opt => opt.nombreCompleto.toLowerCase().includes(sv) || opt.ci.toLowerCase().includes(sv) || opt.telefono.toLowerCase().includes(sv)); }} />
                  </Box>

                  <Box sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto', p: 2 }}>
                    {cartItems.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 8 }}><ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} /><Typography variant="body1" color="text.secondary">No hay productos agregados</Typography><Typography variant="body2" color="text.secondary">Selecciona productos de la lista</Typography></Box>
                    ) : cartItems.map((item, index) => {
                      const totalConDescuento = (item.precio * item.cantidad) - item.descuento;
                      return (<Fade in timeout={300 + index * 100} key={item.id}><Card sx={{ mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), position: 'relative' }}><IconButton size="small" onClick={() => removeItem(item.id)} sx={{ position: 'absolute', top: 4, right: 4, color: '#ef4444' }}><CloseIcon fontSize="small" /></IconButton><CardContent sx={{ pr: 4 }}><Typography variant="subtitle1" fontWeight="bold">{item.nombre}</Typography><Typography variant="caption" color="text.secondary">{item.modelo}</Typography><Box display="flex" justifyContent="space-between" alignItems="center" mt={1}><Typography variant="body2" color="primary" fontWeight="bold">{formatPrice(item.precio)}</Typography><Box display="flex" alignItems="center" gap={0.5}><IconButton size="small" onClick={() => updateQuantity(item.id, item.cantidad - 1)} sx={{ width: 24, height: 24 }}><RemoveIcon sx={{ fontSize: 16 }} /></IconButton><TextField size="small" value={item.cantidad} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} inputProps={{ min: 1, style: { textAlign: 'center', width: 40 } }} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.75rem' } }} /><IconButton size="small" onClick={() => updateQuantity(item.id, item.cantidad + 1)} sx={{ width: 24, height: 24 }}><AddIcon sx={{ fontSize: 16 }} /></IconButton></Box></Box><Stack direction="row" spacing={1} sx={{ mt: 2 }}><TextField size="small" label="Descuento" value={item.descuento} onChange={(e) => updateDiscount(item.id, e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">Bs</InputAdornment> }} sx={{ width: 120 }} /><Box flex={1} textAlign="right"><Typography variant="body2" color="success.main" fontWeight="bold">Total: {formatPrice(totalConDescuento)}</Typography></Box></Stack></CardContent></Card></Fade>);
                    })}
                  </Box>

                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: alpha('#000', 0.02) }}>
                    {ventaError && <Alert severity="error" sx={{ mb: 2 }}>{ventaError}</Alert>}
                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Subtotal:</Typography><Typography variant="body2">{formatPrice(calculateSubtotal())}</Typography></Box>
                      <Box display="flex" justifyContent="space-between"><Typography variant="body2" color="text.secondary">Descuento total:</Typography><Typography variant="body2" color="error">- {formatPrice(calculateTotalDiscount())}</Typography></Box>
                      <Divider />
                      <Box display="flex" justifyContent="space-between"><Typography variant="h6" fontWeight="bold">Total:</Typography><Typography variant="h6" fontWeight="bold" color="primary">{formatPrice(calculateTotal())}</Typography></Box>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}><Button variant="outlined" onClick={clearCart} disabled={cartItems.length === 0 || savingVenta}>Limpiar</Button><Button variant="contained" onClick={handleGenerateSale} disabled={cartItems.length === 0 || savingVenta} sx={{ bgcolor: '#3B82F6' }}>{savingVenta ? <CircularProgress size={24} /> : 'Generar Venta'}</Button></Stack>
                  </Box>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ flexGrow: 1 }}>
              <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <SearchIcon sx={{ color: '#3B82F6' }} /><TextField fullWidth placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} variant="standard" InputProps={{ disableUnderline: true }} />{searchTerm && <IconButton size="small" onClick={() => setSearchTerm('')}><ClearIcon fontSize="small" /></IconButton>}
              </Paper>

              <Grid container spacing={2}>
                {filteredProducts.map((producto, index) => (
                  <Zoom in timeout={300 + index * 100} key={producto.id}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Card sx={{ borderRadius: 3, transition: 'all 0.3s ease', cursor: producto.stock === 0 ? 'not-allowed' : 'pointer', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }, height: '100%', display: 'flex', flexDirection: 'column', opacity: producto.stock === 0 ? 0.6 : 1 }} onClick={() => addToCart(producto)}>
                        {producto.stock === 0 && <Chip label="Sin Stock" size="small" color="error" sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }} />}
                        <CardMedia component="img" height="150" image={producto.imagenUrl || '/images/default-product.png'} alt={producto.nombre} sx={{ objectFit: 'contain', p: 2 }} />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>{producto.modelo}</Typography>
                          <Typography variant="body1" fontWeight="bold" noWrap>{producto.nombre}</Typography>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>{producto.categoria?.nombre} | {producto.marca?.nombre}</Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography variant="h6" color="primary" fontWeight="bold">{formatPrice(producto.precio)}</Typography>
                            <Chip label={`Stock: ${producto.stock}`} size="small" color={producto.stock > 0 ? "success" : "error"} variant="outlined" />
                          </Box>
                          <Button variant="contained" fullWidth size="small" sx={{ mt: 2, bgcolor: '#3B82F6' }} startIcon={<AddIcon />} disabled={producto.stock === 0} onClick={(e) => { e.stopPropagation(); addToCart(producto); }}>Agregar</Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Zoom>
                ))}
                {filteredProducts.length === 0 && !loadingProductos && <Grid item xs={12}><Box sx={{ textAlign: 'center', py: 8 }}><Typography variant="h6" color="text.secondary">No se encontraron productos</Typography></Box></Grid>}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}><Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
      <PDFViewerModal open={openPDF} onClose={() => setOpenPDF(false)} data={pdfData} tipo="venta" />
    </>
  );
};

export const GenerarVenta = () => (
  <UsuarioActualProvider>
    <ProductoProvider>
      <ClienteProvider>
        <VentaProvider>
          <GenerarVentaContent />
        </VentaProvider>
      </ClienteProvider>
    </ProductoProvider>
  </UsuarioActualProvider>
);