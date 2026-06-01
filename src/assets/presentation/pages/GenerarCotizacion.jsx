  import React, { useState } from 'react';
  import {
    Alert,
    alpha,
    Autocomplete,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    CircularProgress,
    Divider,
    Fade,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Slide,
    Snackbar,
    Stack,
    TextField,
    Typography,
    useTheme,
    Zoom
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import CloseIcon from '@mui/icons-material/Close';
  import ClearIcon from '@mui/icons-material/Clear';
  import RemoveIcon from '@mui/icons-material/Remove';
  import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
  import SearchIcon from '@mui/icons-material/Search';
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

  import { useProductos } from '../hooks/useProductos';
  import { useClientes } from '../hooks/useClientes';
  import { useCotizaciones } from '../hooks/useCotizaciones';
  import { PDFViewerModal } from '../components/Modal/PDFViewerModal';
  import { Preloader } from '../components/Preloader';

  import { ProductoProvider } from '../contexts/ProductoContext';
  import { ClienteProvider } from '../contexts/ClienteContext';
  import { CotizacionProvider } from '../contexts/CotizacionContext';
  import { useUsuarioActual } from '../hooks/useUsuarioActual';
  import { UsuarioActualProvider } from '../contexts/UsuarioActualContext';

  // Componente interno que usa los hooks
  const GenerarCotizacionContent = () => {
    const theme = useTheme();
    const { productos, loading: loadingProductos } = useProductos();
    const { clientes, loading: loadingClientes } = useClientes();
    const { createCotizacion, loading: savingCotizacion } = useCotizaciones();
    const { userId, loading: loadingUsuario } = useUsuarioActual();
      
    // Obtener usuario del localStorage
    // const userFromStorage = localStorage.getItem('user');
    // const currentUser = userFromStorage ? JSON.parse(userFromStorage) : null;
    // const userId = currentUser?.id || currentUser?.id_usuario;

    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [openPDF, setOpenPDF] = useState(false);
    
    // Snackbar para mensajes
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'warning' });

    // Fecha de vigencia (1 día después por defecto)
    const [fechaVigencia, setFechaVigencia] = useState(() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const showSnackbar = (message, severity = 'warning') => {
      setSnackbar({ open: true, message, severity });
    };

    // Función para manejar cambios en la fecha
    const handleFechaVigenciaChange = (e) => {
      const value = e.target.value;
      if (!value) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        setFechaVigencia(defaultDate);
        return;
      }
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setFechaVigencia(newDate);
      }
    };

    // Función para obtener el valor seguro para el input
    const getFechaVigenciaValue = () => {
      if (!fechaVigencia || isNaN(fechaVigencia.getTime())) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.toISOString().split('T')[0];
      }
      return fechaVigencia.toISOString().split('T')[0];
    };

    // Filtrar productos por búsqueda
    const filteredProducts = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agregar producto al carrito
    const addToCart = (producto) => {
      const existingItem = cartItems.find(item => item.id === producto.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, {
          id: producto.id,
          nombre: producto.nombre,
          modelo: producto.modelo,
          precio: producto.precio,
          cantidad: 1,
          descuento: 0,
          imagenUrl: producto.imagenUrl,
          stock: producto.stock
        }]);
      }
    };

    // Actualizar cantidad
    const updateQuantity = (id, newQuantity) => {
      if (newQuantity < 1) {
        removeItem(id);
        return;
      }
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, cantidad: newQuantity } : item
      ));
    };

    // Actualizar descuento (como MONTO FIJO en Bs)
    const updateDiscount = (id, discountAmount) => {
      const item = cartItems.find(i => i.id === id);
      if (!item) return;
      
      let newDiscount = parseFloat(discountAmount);
      if (isNaN(newDiscount)) newDiscount = 0;
      if (newDiscount < 0) newDiscount = 0;
      
      const maxDiscount = item.precio * item.cantidad;
      if (newDiscount > maxDiscount) newDiscount = maxDiscount;
      
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, descuento: newDiscount } : item
      ));
    };

    // Eliminar item del carrito
    const removeItem = (id) => {
      setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calcular subtotal
    const calculateSubtotal = () => {
      return cartItems.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
      }, 0);
    };

    // Calcular descuento total (suma de montos fijos)
    const calculateTotalDiscount = () => {
      return cartItems.reduce((total, item) => {
        return total + item.descuento;
      }, 0);
    };

    // Calcular total final
    const calculateTotal = () => {
      return calculateSubtotal() - calculateTotalDiscount();
    };

    // Formatear precio
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2
      }).format(price);
    };

    // Formatear fecha
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    // Limpiar carrito
    const clearCart = () => {
      setCartItems([]);
    };

    // Registrar cotización
    const handleGenerateQuote = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fechaVigencia <= today) {
        showSnackbar('La fecha de vigencia debe ser al menos un día después de hoy', 'error');
        return;
      }
      if (cartItems.length === 0) {
        showSnackbar('Agregue productos a la cotización', 'error');
        return;
      }
      
      if (!selectedCliente) {
        showSnackbar('Seleccione un cliente', 'error');
        return;
      }

      if (!fechaVigencia || isNaN(fechaVigencia.getTime())) {
        showSnackbar('Fecha de vigencia inválida', 'error');
        return;
      }

      const detalles = cartItems.map(item => ({
        id_producto: item.id,
        cantidad: item.cantidad,
        precio_unitario: parseFloat(item.precio),
        descuento: parseFloat(item.descuento) // Descuento en Bs (monto fijo)
      }));

      const vigenciaDate = new Date(fechaVigencia);
      const fechaVigenciaStr = `${vigenciaDate.getFullYear()}-${String(vigenciaDate.getMonth() + 1).padStart(2, '0')}-${String(vigenciaDate.getDate()).padStart(2, '0')} 23:59:59`;

      const cotizacionData = {
        fecha: formatDate(new Date()),
        fecha_vigencia: fechaVigenciaStr,
        id_cliente: parseInt(selectedCliente),
        id_usuario: userId,
        detalles: detalles
      };
      
      const result = await createCotizacion(cotizacionData);
      
      if (result.success) {
        setPdfData(result.data);
        setOpenPDF(true);
        clearCart();
        setSelectedCliente('');
        showSnackbar('Cotización generada exitosamente', 'success');
      } else {
        showSnackbar(result.error, 'error');
      }
    };

    const loading = loadingProductos || loadingClientes || loadingUsuario;

    if (loading) {
      return <Preloader message="Cargando..." fullScreen={false} />;
    }

    return (
      <>
        <Box sx={{ minHeight: '100vh' }}>
          <Container maxWidth={false} disableGutters sx={{ py: 3, px: 2 }}>
            <Grid container spacing={3}>
              {/* Columna izquierda - Carrito de cotización */}
              <Grid item xs={12} md={8} lg={9}>
                <Slide direction="right" in timeout={500}>
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'sticky',
                      top: 20,
                      bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
                    }}
                  >
                    {/* Header del carrito */}
                    <Box sx={{
                      p: 2,
                      bgcolor: '#3B82F6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCartIcon />
                        <Typography variant="h6" fontWeight="bold">
                          Cotización
                        </Typography>
                      </Box>
                      <Badge badgeContent={cartItems.length} color="error">
                        <ReceiptLongIcon />
                      </Badge>
                    </Box>

                    {/* Selector de cliente con búsqueda */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Autocomplete
                        fullWidth
                        size="small"
                        options={clientes}
                        getOptionLabel={(option) => `${option.nombreCompleto} - CI: ${option.ci}`}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={clientes.find(c => c.id === selectedCliente) || null}
                        onChange={(event, newValue) => {
                          setSelectedCliente(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Buscar cliente"
                            placeholder="Escriba nombre, apellido o CI..."
                            variant="outlined"
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {option.nombreCompleto}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                CI: {option.ci} | Tel: {option.telefono}
                              </Typography>
                            </Box>
                          </li>
                        )}
                        noOptionsText="No se encontraron clientes"
                        loadingText="Buscando..."
                        filterOptions={(options, { inputValue }) => {
                          const searchValue = inputValue.toLowerCase();
                          return options.filter(option =>
                            option.nombreCompleto.toLowerCase().includes(searchValue) ||
                            option.ci.toLowerCase().includes(searchValue) ||
                            option.telefono.toLowerCase().includes(searchValue)
                          );
                        }}
                      />
                    </Box>

                    {/* Fecha de vigencia */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Fecha de vigencia"
                        type="date"
                        value={getFechaVigenciaValue()}
                        onChange={handleFechaVigenciaChange}
                        InputLabelProps={{ shrink: true }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        La cotización será válida hasta esta fecha
                      </Typography>
                    </Box>

                    {/* Lista de items del carrito */}
                    <Box sx={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto', p: 2 }}>
                      {cartItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            No hay productos agregados
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Selecciona productos de la lista
                          </Typography>
                        </Box>
                      ) : (
                        cartItems.map((item, index) => {
                          const subtotal = item.precio * item.cantidad;
                          const totalConDescuento = subtotal - item.descuento;
                          return (
                            <Fade in timeout={300 + index * 100} key={item.id}>
                              <Card
                                sx={{
                                  mb: 2,
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                                  transition: 'all 0.3s ease',
                                  '&:hover': { transform: 'translateX(-5px)' },
                                  position: 'relative'
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => removeItem(item.id)}
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    color: '#ef4444',
                                    '&:hover': { bgcolor: alpha('#ef4444', 0.1) }
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>

                                <CardContent sx={{ pr: 4 }}>
                                  <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {item.nombre}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {item.modelo}
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                      <Typography variant="body2" color="primary" fontWeight="bold">
                                        {formatPrice(item.precio)}
                                      </Typography>
                                      <Box display="flex" alignItems="center" gap={0.5}>
                                        <IconButton
                                          size="small"
                                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                          sx={{ bgcolor: alpha('#000', 0.05), width: 24, height: 24 }}
                                        >
                                          <RemoveIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                        <TextField
                                          size="small"
                                          value={item.cantidad}
                                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                          inputProps={{ min: 1, style: { textAlign: 'center', width: 40 } }}
                                          variant="outlined"
                                          sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.75rem' } }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                          sx={{ bgcolor: alpha('#000', 0.05), width: 24, height: 24 }}
                                        >
                                          <AddIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <TextField
                                      size="small"
                                      label="Descuento"
                                      value={item.descuento}
                                      onChange={(e) => updateDiscount(item.id, e.target.value)}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">Bs</InputAdornment>,
                                      }}
                                      sx={{ width: 120, '& .MuiOutlinedInput-root': { fontSize: '0.75rem' } }}
                                    />
                                    <Box flex={1} textAlign="right">
                                      <Typography variant="body2" color="success.main" fontWeight="bold">
                                        Total: {formatPrice(totalConDescuento)}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Fade>
                          );
                        })
                      )}
                    </Box>

                    {/* Resumen y acciones */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: alpha('#000', 0.02) }}>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                          <Typography variant="body2">{formatPrice(calculateSubtotal())}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Descuento total:</Typography>
                          <Typography variant="body2" color="error">- {formatPrice(calculateTotalDiscount())}</Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="h6" fontWeight="bold">Total:</Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {formatPrice(calculateTotal())}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={clearCart}
                          disabled={cartItems.length === 0 || savingCotizacion}
                        >
                          Limpiar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleGenerateQuote}
                          disabled={cartItems.length === 0 || savingCotizacion}
                          sx={{ bgcolor: '#3B82F6' }}
                        >
                          {savingCotizacion ? <CircularProgress size={24} /> : 'Generar Cotización'}
                        </Button>
                      </Stack>
                    </Box>
                  </Paper>
                </Slide>
              </Grid>

              {/* Columna derecha - Lista de productos */}
              <Grid item xs={12} md={8} lg={9} sx={{ flexGrow: 1 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%'
                  }}
                >
                  <SearchIcon sx={{ color: '#3B82F6' }} />
                  <TextField
                    fullWidth
                    placeholder="Buscar productos por nombre, modelo o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                  />
                  {searchTerm && (
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </Paper>

                <Grid container spacing={2}>
                  {filteredProducts.map((producto, index) => (
                    <Zoom in timeout={300 + index * 100} key={producto.id}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: 6,
                            },
                            bgcolor: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={() => addToCart(producto)}
                        >
                          {producto.stock === 0 && (
                            <Chip
                              label="Sin stock"
                              size="small"
                              color="error"
                              sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                            />
                          )}

                          <CardMedia
                            component="img"
                            height="150"
                            image={producto.imagenUrl || '/images/default-product.png'}
                            alt={producto.nombre}
                            sx={{ objectFit: 'contain', p: 2 }}
                          />

                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {producto.modelo}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" noWrap>
                              {producto.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              {producto.categoria?.nombre} | {producto.marca?.nombre}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {formatPrice(producto.precio)}
                              </Typography>
                              <Chip
                                label={`Stock: ${producto.stock}`}
                                size="small"
                                color={producto.stock > 0 ? "success" : "error"}
                                variant="outlined"
                              />
                            </Box>
                            <Button
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{ mt: 2, bgcolor: '#3B82F6' }}
                              startIcon={<AddIcon />}
                              disabled={producto.stock === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(producto);
                              }}
                            >
                              Agregar
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Zoom>
                  ))}

                  {filteredProducts.length === 0 && !loadingProductos && (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                          No se encontraron productos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Intenta con otros términos de búsqueda
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Snackbar para mensajes */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Modal del PDF */}
        <PDFViewerModal
          open={openPDF}
          onClose={() => setOpenPDF(false)}
          data={pdfData}
          tipo="cotizacion"
        />
      </>
    );
  };

  // Componente principal con los Providers
  export const GenerarCotizacion = () => {
    return (
      <UsuarioActualProvider>
        <ProductoProvider>
          <ClienteProvider>
            <CotizacionProvider>
              <GenerarCotizacionContent />
            </CotizacionProvider>
          </ClienteProvider>
        </ProductoProvider>
      </UsuarioActualProvider>
    );
  };