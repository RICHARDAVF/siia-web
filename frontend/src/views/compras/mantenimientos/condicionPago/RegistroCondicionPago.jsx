import React from 'react';
import { Form, Input, Checkbox, Radio, Row, Col, Button, InputNumber } from 'antd';

const RegistroCondicionPago = () => {
  return (
    <Form layout="horizontal">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Codigo">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Nombre">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="N° Letras">
            <InputNumber min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Dias">
            <InputNumber min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tipo de Pago">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tipo de Documento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Descuento">
            <InputNumber min={0} step={0.01} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Checkbox>Descuento Único</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Adelanto</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Agrupar Crédito</Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Checkbox>Recogo de Compras</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Compras Nacionales</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Compras de Importación</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Ventas</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item>
            <Checkbox>No Considerar en Registro de Ventas</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>No Valida contra la Línea de Crédito</Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Checkbox>Visualizar en Tienda</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Aprobación Automática Pedido</Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Checkbox>Título Gratuito</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Activo</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary">Enviar</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistroCondicionPago;
