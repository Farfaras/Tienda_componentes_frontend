export class Producto {
  constructor({
    id_producto,
    modelo,
    nombre,
    descripcion,
    imagen,
    imagen_url,
    precio,
    stock,
    estado,
    id_categoria,
    id_marca,
    categoria,
    marca,
    created_at,
    updated_at
  }) {
    this.id = id_producto;
    this.modelo = modelo;
    this.nombre = nombre;
    this.descripcion = descripcion || '';
    this.imagen = imagen;
    
    // this.imagenUrl = imagen_url || (imagen ? `http://localhost:8000/storage/${imagen}` : null);

    this.imagenUrl = imagen_url || (imagen ? `https://tienda-componenetes-backend.onrender.com//storage/${imagen}` : null);
    this.precio = parseFloat(precio);
    this.stock = stock;
    this.estado = estado;
    this.categoriaId = id_categoria;
    this.marcaId = id_marca;
    this.categoria = categoria;
    this.marca = marca;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  get nombreCompleto() {
    return `${this.nombre} (${this.modelo})`;
  }

  isActive() {
    return this.estado === true;
  }

  hasStock() {
    return this.stock > 0;
  }

  getImagenUrl() {
    if (this.imagenUrl) return this.imagenUrl;
    //if (this.imagen) return `http://localhost:8000/storage/${this.imagen}`;
    if (this.imagen) return `https://tienda-componenetes-backend.onrender.com/storage/${this.imagen}`;
    return '/images/default-product.png';
  }

  toFormData() {
    const formData = new FormData();
    formData.append('modelo', this.modelo);
    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('precio', this.precio);
    formData.append('stock', this.stock);
    formData.append('estado', this.estado);
    formData.append('id_categoria', this.categoriaId);
    formData.append('id_marca', this.marcaId);
    return formData;
  }
}