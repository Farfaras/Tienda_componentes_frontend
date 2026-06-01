import React, { createContext, useState, useEffect, useCallback } from 'react';
import { CategoriaRepositoryImpl } from '../../infrastructure/repositories/CategoriaRepositoryImpl';
import { GetCategoriasUseCase } from '../../core/usecases/categorias/GetCategoriasUseCase';
import { CreateCategoriaUseCase } from '../../core/usecases/categorias/CreateCategoriaUseCase';
import { UpdateCategoriaUseCase } from '../../core/usecases/categorias/UpdateCategoriaUseCase';
import { DeleteCategoriaUseCase } from '../../core/usecases/categorias/DeleteCategoriaUseCase';

export const CategoriaContext = createContext(null);

const categoriaRepository = new CategoriaRepositoryImpl();
const getCategoriasUseCase = new GetCategoriasUseCase(categoriaRepository);
const createCategoriaUseCase = new CreateCategoriaUseCase(categoriaRepository);
const updateCategoriaUseCase = new UpdateCategoriaUseCase(categoriaRepository);
const deleteCategoriaUseCase = new DeleteCategoriaUseCase(categoriaRepository);

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getCategoriasUseCase.execute();
    if (result.success) {
      setCategorias(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  const createCategoria = useCallback(async (categoriaData) => {
    const result = await createCategoriaUseCase.execute(categoriaData);
    if (result.success) {
      await loadCategorias();
    }
    return result;
  }, [loadCategorias]);

  const updateCategoria = useCallback(async (id, categoriaData) => {
    const result = await updateCategoriaUseCase.execute(id, categoriaData);
    if (result.success) {
      await loadCategorias();
    }
    return result;
  }, [loadCategorias]);

  const deleteCategoria = useCallback(async (id) => {
    const result = await deleteCategoriaUseCase.execute(id);
    if (result.success) {
      await loadCategorias();
    }
    return result;
  }, [loadCategorias]);

  const value = {
    categorias,
    loading,
    error,
    loadCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
  };

  return React.createElement(CategoriaContext.Provider, { value }, children);
}