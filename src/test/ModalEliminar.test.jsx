import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModalEliminar } from '../assets/presentation/components/Modal/ModalEliminar';
import { ThemeProvider } from '../assets/presentation/contexts/ThemeContext';

describe('ModalEliminar Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const renderModal = (open = true) => {
    return render(
      <ThemeProvider>
        <ModalEliminar
          open={open}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Eliminar Producto"
          itemName="Producto Test"
          loading={false}
        />
      </ThemeProvider>
    );
  };

  it('debe renderizar el título del modal', () => {
    renderModal();
    expect(screen.getByText('Eliminar Producto')).toBeDefined();
  });

  it('debe renderizar el botón de cancelar', () => {
    renderModal();
    expect(screen.getByText('Cancelar')).toBeDefined();
  });

  it('debe renderizar el botón de eliminar', () => {
    renderModal();
    expect(screen.getByText('Eliminar')).toBeDefined();
  });
});