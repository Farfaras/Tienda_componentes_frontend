// src/infrastructure/api/axiosConfig.js
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

 const API_BASE_URL = 'https://tienda-componenetes-backend.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error de conexión (servidor caído, red, etc.)
    if (error.code === 'ERR_CONNECTION_REFUSED' || error.message === 'Network Error') {
      console.error('❌ Error de conexión con el servidor');
      
      // Limpiar token y redirigir a login
      localStorage.removeItem('token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Error de conexión con el servidor'));
    }
    
    // Error 401 (no autorizado / token expirado)
    if (error.response?.status === 401) {
      console.error('❌ Token expirado o inválido');
      
      localStorage.removeItem('token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);