export class Cliente {
  constructor({
    id_cliente,
    ci,
    nombre,
    apellido,
    telefono,
    estado,
    created_at,
    updated_at
  }) {
    this.id = id_cliente;
    this.ci = ci;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.estado = estado;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  isActive() {
    return this.estado === true;
  }

  toJSON() {
    return {
      ci: this.ci,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      estado: this.estado
    };
  }
}