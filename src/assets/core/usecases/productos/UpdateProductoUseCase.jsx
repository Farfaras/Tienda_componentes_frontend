export class UpdateProductoUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(id, productoData) {
    if (!id) {
      return { success: false, error: 'ID de producto requerido' };
    }

    // Verificar si es FormData o objeto normal
    let modelo, nombre, precio, id_categoria, id_marca;
    
    if (productoData instanceof FormData) {
      modelo = productoData.get('modelo');
      nombre = productoData.get('nombre');
      precio = productoData.get('precio');
      id_categoria = productoData.get('id_categoria');
      id_marca = productoData.get('id_marca');
    } else {
      modelo = productoData.modelo;
      nombre = productoData.nombre;
      precio = productoData.precio;
      id_categoria = productoData.id_categoria;
      id_marca = productoData.id_marca;
    }
    
    // Validaciones
    if (!modelo || modelo.trim() === '') {
      return { success: false, error: 'El modelo es requerido' };
    }
    if (!nombre || nombre.trim() === '') {
      return { success: false, error: 'El nombre es requerido' };
    }
    if (!precio || parseFloat(precio) <= 0) {
      return { success: false, error: 'El precio debe ser mayor a 0' };
    }
    if (!id_categoria) {
      return { success: false, error: 'La categoría es requerida' };
    }
    if (!id_marca) {
      return { success: false, error: 'La marca es requerida' };
    }

    try {
      const response = await this.productoRepository.updateProducto(id, productoData);
      return {
        success: true,
        data: response,
        message: 'Producto actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar el producto'
      };
    }
  }
}