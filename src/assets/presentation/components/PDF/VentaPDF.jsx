import React from 'react';
import { Page, Document, StyleSheet, View, Text, Image } from '@react-pdf/renderer';
import logo from '../../../images/computer_city.jpg';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },

  // HEADER UNIFICADO
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  headerLeft: {
    width: '25%',
  },

  headerCenter: {
    width: '50%',
    textAlign: 'center',
  },

  headerRight: {
    width: '25%',
    textAlign: 'right',
  },

  logo: {
    width: 90,
    height: 60,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },

  companyInfo: {
    fontSize: 9,
    marginBottom: 10,
  },

  // INFO CLIENTE
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  infoLeft: {
    width: '60%',
  },

  infoRight: {
    width: '40%',
    textAlign: 'right',
  },

  bold: {
    fontWeight: 'bold',
  },

  // TABLA
  table: {
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1D4ED8',
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 6,
  },

  cellCantidad: { width: '15%', textAlign: 'center' },
  cellDescripcion: { width: '35%' },
  cellPrecio: { width: '20%', textAlign: 'center' },
  cellDescuento: { width: '15%', textAlign: 'center' },
  cellTotal: { width: '15%', textAlign: 'center' },

  // TOTALES
  totalsContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },

  totalsBox: {
    width: '40%',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },

  totalFinal: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export const VentaPDF = ({ data }) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(parseFloat(price));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const subtotal = data.detalles.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER UNIFICADO */}
        <View style={styles.headerTop}>

          <View style={styles.headerLeft}>
            <Image style={styles.logo} src={logo} />
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>ORDEN DE VENTA</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.orderNumber}>
              N° {String(data.nroDocumento).padStart(6, '0')}
            </Text>
          </View>

        </View>

        {/* INFO EMPRESA */}
        <View style={styles.companyInfo}>
          <Text>Empresa: ComputerCity</Text>
        </View>

        {/* INFO CLIENTE */}
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Text>
              <Text style={styles.bold}>Cliente: </Text>
              {data.cliente.nombre} {data.cliente.apellido}
            </Text>
            <Text>
              <Text style={styles.bold}>CI: </Text>
              {data.cliente.ci}
            </Text>
            <Text>
              <Text style={styles.bold}>Tel: </Text>
              {data.cliente.telefono}
            </Text>
            <Text>
              <Text style={styles.bold}>Vendedor: </Text>
              {data.usuario.nombre} {data.usuario.apellido}
            </Text>
          </View>

          <View style={styles.infoRight}>
            <Text>
              <Text style={styles.bold}>Fecha: </Text>
              {formatDate(data.fecha)}
            </Text>
          </View>
        </View>

        {/* TABLA */}
        <View style={styles.table}>

          <View style={styles.tableHeader}>
            <Text style={styles.cellCantidad}>Cant.</Text>
            <Text style={styles.cellDescripcion}>Descripción</Text>
            <Text style={styles.cellPrecio}>P. Unit</Text>
            <Text style={styles.cellDescuento}>Desc.</Text>
            <Text style={styles.cellTotal}>Total</Text>
          </View>

          {data.detalles.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cellCantidad}>{item.cantidad}</Text>
              <Text style={styles.cellDescripcion}>{item.producto.nombre}</Text>
              <Text style={styles.cellPrecio}>{formatPrice(item.precio_unitario)}</Text>
              <Text style={styles.cellDescuento}>{item.descuento}</Text>
              <Text style={styles.cellTotal}>{formatPrice(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* TOTALES */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            
            <View style={styles.totalRow}>
              <Text>Subtotal:</Text>
              <Text>{formatPrice(subtotal)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Total:</Text>
              <Text style={styles.totalFinal}>{formatPrice(data.total)}</Text>
            </View>

          </View>
        </View>

      </Page>
    </Document>
  );
};