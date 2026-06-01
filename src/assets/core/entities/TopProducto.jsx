export class TopProducto {
  constructor({ id_producto, nombre, modelo, total_unidades_vendidas, total_ingresos, numero_ventas }) {
    this.id = id_producto;
    this.nombre = nombre;
    this.modelo = modelo;
    this.totalUnidades = total_unidades_vendidas;
    this.totalIngresos = parseFloat(total_ingresos);
    this.numeroVentas = numero_ventas;
  }
}