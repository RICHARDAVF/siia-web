import React from 'react';
import { Form, Input, DatePicker, Select, Button, Table, Row, Col } from 'antd';

const { Option } = Select;

const columns = [
  {
    title: 'Descripción',
    dataIndex: 'descripcion',
  },
  {
    title: 'Unidad de Medida',
    dataIndex: 'unidadMedida',
  },
  {
    title: 'Cantidad',
    dataIndex: 'cantidad',
  },
  {
    title: 'Costo',
    dataIndex: 'costo',
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal',
  },
  {
    title: 'Afectación',
    dataIndex: 'afectacion',
  },
];

const data = [];

const RegistroDocumentos = () => {
  return (
    <Form layout="horizontal">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Fecha">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Condiciones de Pago">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Proveedor">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tipo de Documento">
            <Select>
              <Option value="factura">Factura</Option>
              <Option value="boleta">Boleta</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Serie">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Número de Documento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Observaciones">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Detalles de los Artículos">
        <Table columns={columns} dataSource={data} pagination={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Guardar</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistroDocumentos;
