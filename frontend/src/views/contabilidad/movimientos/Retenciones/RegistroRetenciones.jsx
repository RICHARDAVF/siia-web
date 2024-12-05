import React from 'react';
import { Form, Input, DatePicker, Select, Button, Table, Row, Col } from 'antd';

const { Option } = Select;

const columns = [
  {
    title: 'Cuenta',
    dataIndex: 'cuenta',
  },
  {
    title: 'Auxiliar',
    dataIndex: 'auxiliar',
  },
  {
    title: 'Vendedor',
    dataIndex: 'vendedor',
  },
  {
    title: 'F/. Emision',
    dataIndex: 'fechaEmision',
  },
  {
    title: 'T.D.',
    dataIndex: 'td',
  },
  {
    title: 'Serie',
    dataIndex: 'serie',
  },
  {
    title: 'Numero Doc',
    dataIndex: 'numeroDoc',
  },
  {
    title: 'Cod. Territ.',
    dataIndex: 'codTerrit',
  },
  {
    title: 'Mon',
    dataIndex: 'mon',
  },
  {
    title: 'Debe Soles',
    dataIndex: 'debeSoles',
  },
  {
    title: 'Haber Soles',
    dataIndex: 'haberSoles',
  },
  {
    title: 'T.Cambio',
    dataIndex: 'tcambio',
  },
  {
    title: 'Debe Dolares',
    dataIndex: 'debeDolares',
  },
  {
    title: 'Haber Dolares',
    dataIndex: 'haberDolares',
  },
  {
    title: 'Glosa',
    dataIndex: 'glosa',
  },
];

const data = [];

const RegistroRetenciones = () => {
  return (
    <Form layout="horizontal">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Fecha Contab.">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Fecha Emision">
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Modulo Adm.">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Origen">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ubicacion">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="# Comprobante">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Observ/Glosa">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Detalle de Cuentas">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Buscar Documentos</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistroRetenciones;
