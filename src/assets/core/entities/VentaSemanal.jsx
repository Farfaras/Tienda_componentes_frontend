export class VentaSemanal {
  constructor({ dia, fecha, total_ventas, cantidad_ventas }) {
    this.dia = dia;
    this.fecha = fecha;
    this.totalVentas = parseFloat(total_ventas);
    this.cantidadVentas = cantidad_ventas;
  }
}