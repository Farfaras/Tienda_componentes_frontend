export class CotizacionReporte {
  constructor({
    id_documento,
    nro_documento,
    fecha,
    fecha_vigencia,
    total,
    estado,
    id_cliente,
    id_usuario,
    cliente,
    usuario,
    detalles
  }) {
    this.id = id_documento;
    this.nroDocumento = nro_documento;
    this.fecha = fecha;
    this.fechaVigencia = fecha_vigencia;
    this.total = parseFloat(total);
    this.estado = estado;
    this.clienteId = id_cliente;
    this.usuarioId = id_usuario;
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

  formatDate() {
    const d = new Date(this.fecha);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  formatTotal() {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(this.total);
  }
}