export class UsuarioActual {
  constructor({
    id_usuario,
    nombre,
    apellido,
    email,
    direccion,
    estado,
    two_factor_confirmed,
    id_rol,
    rol
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
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  isAdmin() {
    return this.rol?.nombre === 'Administrador';
  }

  getUserId() {
    return this.id;
  }
}