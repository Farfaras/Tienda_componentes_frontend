import { ProductoRepository } from '../../core/repositories/ProductoRepository';
import { apiClient } from '../api/axiosConfig';
import { Producto } from '../../core/entities/Producto';

// Imagen por defecto
const DEFAULT_IMAGE_URL = '/images/default-product.png';

export class ProductoRepositoryImpl extends ProductoRepository {
  async getProductos() {
    try {
      const response = await apiClient.get('/productos');
      const sortedData = [...response.data].sort((a, b) => b.id_producto - a.id_producto);
      return sortedData.map(producto => new Producto(producto));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos');
    }
  }

  async getProductoById(id) {
    try {
      const response = await apiClient.get(`/productos/${id}`);
      return new Producto(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener producto');
    }
  }

    async createProducto(data) {
    try {
        let formData;
        
        if (data instanceof FormData) {
        formData = data;
        } else {
        formData = new FormData();
        formData.append('modelo', data.modelo);
        formData.append('nombre', data.nombre);
        formData.append('descripcion', data.descripcion || '');
        formData.append('precio', data.precio);
        formData.append('stock', data.stock || 0);
        formData.append('estado', data.estado !== undefined ? data.estado : true);
        formData.append('id_categoria', data.id_categoria);
        formData.append('id_marca', data.id_marca);
        
        // 👈 SOLO enviar imagen si es un archivo
        if (data.imagen && data.imagen instanceof File) {
            formData.append('imagen', data.imagen);
        }
        }

        const response = await apiClient.post('/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        });
        return new Producto(response.data.data);
    } catch (error) {
        if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
        }
        throw new Error(error.response?.data?.message || 'Error al crear producto');
    }
    }

  async updateProducto(id, data) {
    try {
      let requestData;
      let headers = {};

      if (data instanceof FormData) {
        // Si es FormData, usarlo directamente
        requestData = data;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        requestData = data;
        headers = { 'Content-Type': 'application/json' };
      }

      const response = await apiClient.post(`/productos/${id}`, requestData, { headers });
      return new Producto(response.data.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Error de validación';
        throw new Error(firstError);
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar producto');
    }
  }

  async deleteProducto(id) {
    try {
      const response = await apiClient.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar producto');
    }
  }
}