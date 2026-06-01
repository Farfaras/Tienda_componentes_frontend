import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ProductoRepositoryImpl } from '../../infrastructure/repositories/ProductoRepositoryImpl';
import { GetProductosUseCase } from '../../core/usecases/productos/GetProductosUseCase';
import { CreateProductoUseCase } from '../../core/usecases/productos/CreateProductoUseCase';
import { UpdateProductoUseCase } from '../../core/usecases/productos/UpdateProductoUseCase';
import { DeleteProductoUseCase } from '../../core/usecases/productos/DeleteProductoUseCase';

export const ProductoContext = createContext(null);

const productoRepository = new ProductoRepositoryImpl();
const getProductosUseCase = new GetProductosUseCase(productoRepository);
const createProductoUseCase = new CreateProductoUseCase(productoRepository);
const updateProductoUseCase = new UpdateProductoUseCase(productoRepository);
const deleteProductoUseCase = new DeleteProductoUseCase(productoRepository);

export function ProductoProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getProductosUseCase.execute();
    if (result.success) {
      setProductos(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

    const createProducto = useCallback(async (productoData) => {
    console.log('📦 ProductoContext - createProducto recibió:', productoData);
    console.log('  - es FormData?', productoData instanceof FormData);
    
    const result = await createProductoUseCase.execute(productoData);
    console.log('📦 Resultado de useCase:', result);
    
    if (result.success) {
        await loadProductos();
    }
    return result;
    }, [loadProductos]);

  const updateProducto = useCallback(async (id, productoData) => {
    const result = await updateProductoUseCase.execute(id, productoData);
    if (result.success) {
      await loadProductos();
    }
    return result;
  }, [loadProductos]);

  const deleteProducto = useCallback(async (id) => {
    const result = await deleteProductoUseCase.execute(id);
    if (result.success) {
      await loadProductos();
    }
    return result;
  }, [loadProductos]);

  const value = {
    productos,
    loading,
    error,
    loadProductos,
    createProducto,
    updateProducto,
    deleteProducto
  };

  return React.createElement(ProductoContext.Provider, { value }, children);
}