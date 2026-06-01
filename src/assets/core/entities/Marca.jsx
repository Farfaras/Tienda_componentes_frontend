export class Marca {
  constructor({
    id_marca,
    nombre,
    descripcion,
    estado,
    created_at,
    updated_at
  }) {
    this.id = id_marca;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  isActive() {
    return this.estado === true;
  }

  toJSON() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      estado: this.estado
    };
  }
}