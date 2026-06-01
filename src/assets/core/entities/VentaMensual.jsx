export class VentaMensual {
  constructor({ mes, anio, mes_numero, total_ventas, cantidad_ventas }) {
    this.mes = mes;
    this.anio = anio;
    this.mesNumero = mes_numero;
    this.totalVentas = parseFloat(total_ventas);
    this.cantidadVentas = cantidad_ventas;
  }
}