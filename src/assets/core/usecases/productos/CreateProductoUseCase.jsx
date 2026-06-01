export class CreateProductoUseCase {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async execute(productoData) {
    // Verificar si es FormData o objeto normal
    let modelo, nombre, precio, id_categoria, id_marca;
    
    if (productoData instanceof FormData) {
      // Si es FormData, usar .get()
      modelo = productoData.get('modelo');
      nombre = productoData.get('nombre');
      precio = productoData.get('precio');
      id_categoria = productoData.get('id_categoria');
      id_marca = productoData.get('id_marca');
      
      console.log('📦 FormData recibido en UseCase:');
      console.log('  - modelo:', modelo);
      console.log('  - nombre:', nombre);
      console.log('  - precio:', precio);
      console.log('  - id_categoria:', id_categoria);
      console.log('  - id_marca:', id_marca);
    } else {
      // Si es objeto normal
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
      const response = await this.productoRepository.createProducto(productoData);
      return {
        success: true,
        data: response,
        message: 'Producto creado correctamente'
      };
    } catch (error) {
      console.error('Error en CreateProductoUseCase:', error);
      return {
        success: false,
        error: error.message || 'Error al crear el producto'
      };
    }
  }
}