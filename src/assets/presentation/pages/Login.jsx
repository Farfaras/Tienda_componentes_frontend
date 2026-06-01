// src/presentation/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { 
  Button, TextField, Box, Typography, Stack, Alert, CircularProgress,
  InputAdornment, IconButton, Paper, Fade, Zoom, Snackbar,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../contexts/ThemeContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import ErrorIcon from '@mui/icons-material/Error';
import computer_city from '../../images/computer_city.jpg';
import Verify2FAModal from '../components/Verify2FAModal';
import { useUsuarioActual } from '../hooks/useUsuarioActual';
import '../../styles/login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { mode } = useThemeContext();
  const { refreshUser } = useUsuarioActual();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [animate, setAnimate] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Animación de entrada
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Validaciones
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!email) return 'El correo electrónico es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un correo electrónico válido';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = name === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError,
    });
    setTouched({
      email: true,
      password: true,
    });
    
    return !emailError && !passwordError;
  };

  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!validateForm()) {
        return;
      }
      
      setLoading(true);

      try {
        const result = await login(formData);
        
        if (result.requiresTwoFactor) {
          setTempEmail(result.email);
          setShow2FAModal(true);
        } else if (!result.success) {
          showSnackbar(result.error || 'Credenciales inválidas');
          setErrors(prev => ({ ...prev, password: 'Credenciales inválidas' }));
        } else {
          // 👈 Después del login exitoso, recargar datos del usuario
          await refreshUser();
          navigate('/');
        }
      } catch (err) {
        showSnackbar(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    };

  const handleClose2FAModal = () => {
    setShow2FAModal(false);
    setTempEmail('');
  };

  const handle2FASuccess = async () => {
      // 👈 Después de verificar 2FA, recargar datos del usuario
      await refreshUser();
      setShow2FAModal(false);
      navigate('/');
    };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isDarkMode = mode === 'dark';

  return (
    <>
      <Box
        className="login-container"
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)'
            : 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Fondos animados */}
        <Box className="animated-bg">
          <div className="bg-shape shape1"></div>
          <div className="bg-shape shape2"></div>
          <div className="bg-shape shape3"></div>
          <div className="bg-shape shape4"></div>
        </Box>

        {/* Tarjeta de login */}
        <Zoom in={animate} timeout={600}>
          <Paper
            elevation={24}
            className="login-card"
            sx={{
              width: { xs: '90%', sm: 420 },
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: isDarkMode 
                ? 'rgba(30, 41, 59, 0.95)'
                : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              boxShadow: isDarkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Logo y título */}
            <Fade in={animate} timeout={800}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  component="img"
                  src={computer_city}
                  alt="Logo"
                  className="login-logo"
                  sx={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    mb: 2,
                    mx: 'auto',
                    display: 'block',
                    boxShadow: 3,
                    border: '3px solid white',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  ComputerCity
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#94A3B8' : '#64748B',
                  }}
                >
                  Inicia sesión para continuar
                </Typography>
              </Box>
            </Fade>

            {/* Formulario */}
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                {/* Campo Email */}
                <Fade in={animate} timeout={1000}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      error={touched.email && !!errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#1565C0' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(21, 101, 192, 0.2)',
                          },
                        },
                      }}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error sx={{ ml: 1, mt: 0.5 }}>
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Box>
                </Fade>

                {/* Campo Contraseña */}
                <Fade in={animate} timeout={1200}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      error={touched.password && !!errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#1565C0' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px 0 rgba(21, 101, 192, 0.2)',
                          },
                        },
                      }}
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error sx={{ ml: 1, mt: 0.5 }}>
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Box>
                </Fade>

                {/* Botón Submit */}
                <Fade in={animate} timeout={1400}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    className="login-button"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px 0 rgba(21, 101, 192, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <LoginIcon sx={{ mr: 1 }} />
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </Fade>
              </Stack>
            </form>

            {/* Footer */}
            <Fade in={animate} timeout={1600}>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                  © {new Date().getFullYear()} ComputerCity. Todos los derechos reservados.
                </Typography>
              </Box>
            </Fade>
          </Paper>
        </Zoom>
      </Box>

      {/* Snackbar para errores */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          icon={<ErrorIcon />}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Verify2FAModal
        open={show2FAModal}
        onClose={handleClose2FAModal}
        email={tempEmail}
        onSuccess={handle2FASuccess}
      />
    </>
  );
};