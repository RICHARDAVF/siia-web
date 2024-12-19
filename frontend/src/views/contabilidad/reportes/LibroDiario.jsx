import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Componente PDF
const MyPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {data.map((item, index) => (
        <View key={index} style={styles.section}>
          <Text style={{color:'red'}}>{item.nombre}</Text>
          <Text style={{color:'green'}}>{item.detalle}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

// Datos de ejemplo
const dataSource = [
  { key: '1', nombre: 'Cliente 1', detalle: 'Detalle 1' },
  { key: '2', nombre: 'Cliente 2', detalle: 'Detalle 2' },
  { key: '3', nombre: 'Cliente 3', detalle: 'Detalle 3' },
];

// Columnas de la tabla
const columns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Detalle',
    dataIndex: 'detalle',
    key: 'detalle',
  },
];

// Componente principal
const Reporte = () => {
  const [data, setData] = useState(dataSource);

  const abrirPDF = async () => {
    // Generar el PDF
    const doc = <MyPDF data={data} />;
    const asPDF = pdf([]);
    asPDF.updateContainer(doc);
    const blob = await asPDF.toBlob();

    // Crear una URL para el Blob y abrir una nueva ventana
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div>
      <Table dataSource={data} columns={columns} />
      <Button onClick={abrirPDF}>Abrir PDF en Nueva Ventana</Button>
    </div>
  );
};

export default Reporte;
