export class Cotizacion {
  constructor({
    id_documento,
    nro_documento,
    fecha,
    fecha_vigencia,
    tipo_documento,
    total,
    estado,
    id_cliente,
    id_usuario,
    created_at,
    updated_at,
    cliente,
    usuario,
    detalles
  }) {
    this.id = id_documento;
    this.nroDocumento = nro_documento;
    this.fecha = fecha;
    this.fechaVigencia = fecha_vigencia;
    this.tipoDocumento = tipo_documento;
    this.total = parseFloat(total);
    this.estado = estado;
    this.clienteId = id_cliente;
    this.usuarioId = id_usuario;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.cliente = cliente;
    this.usuario = usuario;
    this.detalles = detalles;
  }

  getClienteNombre() {
    if (!this.cliente) return 'Cliente no especificado';
    return `${this.cliente.nombre} ${this.cliente.apellido}`;
  }

  getUsuarioNombre() {
    if (!this.usuario) return 'Usuario no especificado';
    return `${this.usuario.nombre} ${this.usuario.apellido}`;
  }
}