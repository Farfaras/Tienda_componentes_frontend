import React, { createContext, useState, useEffect, useCallback } from 'react';
import { MarcaRepositoryImpl } from '../../infrastructure/repositories/MarcaRepositoryImpl';
import { GetMarcasUseCase } from '../../core/usecases/marcas/GetMarcasUseCase';
import { CreateMarcaUseCase } from '../../core/usecases/marcas/CreateMarcaUseCase';
import { UpdateMarcaUseCase } from '../../core/usecases/marcas/UpdateMarcaUseCase';
import { DeleteMarcaUseCase } from '../../core/usecases/marcas/DeleteMarcaUseCase';

export const MarcaContext = createContext(null);

const marcaRepository = new MarcaRepositoryImpl();
const getMarcasUseCase = new GetMarcasUseCase(marcaRepository);
const createMarcaUseCase = new CreateMarcaUseCase(marcaRepository);
const updateMarcaUseCase = new UpdateMarcaUseCase(marcaRepository);
const deleteMarcaUseCase = new DeleteMarcaUseCase(marcaRepository);

export function MarcaProvider({ children }) {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMarcas = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getMarcasUseCase.execute();
    if (result.success) {
      setMarcas(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMarcas();
  }, [loadMarcas]);

  const createMarca = useCallback(async (marcaData) => {
    const result = await createMarcaUseCase.execute(marcaData);
    if (result.success) {
      await loadMarcas();
    }
    return result;
  }, [loadMarcas]);

  const updateMarca = useCallback(async (id, marcaData) => {
    const result = await updateMarcaUseCase.execute(id, marcaData);
    if (result.success) {
      await loadMarcas();
    }
    return result;
  }, [loadMarcas]);

  const deleteMarca = useCallback(async (id) => {
    const result = await deleteMarcaUseCase.execute(id);
    if (result.success) {
      await loadMarcas();
    }
    return result;
  }, [loadMarcas]);

  const value = {
    marcas,
    loading,
    error,
    loadMarcas,
    createMarca,
    updateMarca,
    deleteMarca
  };

  return React.createElement(MarcaContext.Provider, { value }, children);
}