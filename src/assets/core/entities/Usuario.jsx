export class Usuario {
  constructor({
    id_usuario,
    nombre,
    apellido,
    email,
    direccion,
    estado,
    two_factor_confirmed,
    id_rol,
    rol,
    created_at,
    updated_at
  }) {
    this.id = id_usuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.direccion = direccion;
    this.estado = estado;
    this.twoFactorConfirmed = two_factor_confirmed;
    this.rolId = id_rol;
    this.rol = rol;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  isActive() {
    return this.estado === true;
  }

  isAdmin() {
    return this.rol?.nombre === 'Administrador';
  }

  isTwoFactorConfirmed() {
    return this.twoFactorConfirmed === true;
  }

  toJSON(includePassword = false) {
    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      direccion: this.direccion,
      estado: this.estado,
      id_rol: this.rolId
    };
    return data;
  }
}