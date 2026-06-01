import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../assets/presentation/contexts/ThemeContext';
import { DataTable } from '../assets/presentation/components/DataTable/DataTable';

// Mock de useMediaQuery para evitar errores
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(() => false)
  };
});

// Mock de DataTableSearch para simplificar
vi.mock('../assets/components/DataTable/DataTableSearch', () => ({
  DataTableSearch: () => <input placeholder="Buscar..." />
}));

describe('DataTable Component', () => {
  const mockColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 }
  ];

  const mockRows = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@test.com' },
    { id: 2, nombre: 'María López', email: 'maria@test.com' }
  ];

  const renderDataTable = () => {
    return render(
      <ThemeProvider>
        <DataTable 
          columns={mockColumns} 
          rows={mockRows}
          searchable={true}
          searchPlaceholder="Buscar..."
        />
      </ThemeProvider>
    );
  };

  it('debe renderizar la tabla con los encabezados', () => {
    renderDataTable();
    
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Nombre')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
  });

  it('debe renderizar los datos de las filas', () => {
    renderDataTable();
    
    expect(screen.getByText('Juan Pérez')).toBeDefined();
    expect(screen.getByText('juan@test.com')).toBeDefined();
    expect(screen.getByText('María López')).toBeDefined();
  });

  it('debe renderizar el buscador', () => {
    renderDataTable();
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    expect(searchInput).toBeDefined();
  });
});