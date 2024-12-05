import React from 'react';
import { Form, Input, Checkbox, Radio, InputNumber, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const InputForm = () => (
  <div>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Cuenta">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Nombre">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Moneda (S D O o en Vacío)">
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Transferencia al Debe">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Transferencia al Haber">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Entidad Financiera">
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Nº de la Cuenta">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Descripción">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Distribución de Gastos">
          <Input.Group compact>
            <Form.Item label="1ra Posición">
              <InputNumber />
            </Form.Item>
            <Form.Item label="2da Posición">
              <InputNumber />
            </Form.Item>
            <Form.Item label="3ra Posición">
              <InputNumber />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="4ta Posición">
          <InputNumber />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="5ta Posición">
          <InputNumber />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Scta Presupuesto">
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Cuenta Anterior">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Filtros">
          <Select>
            <Option value="filtro1">Filtro 1</Option>
            <Option value="filtro2">Filtro 2</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Cuenta para el PDT">
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="Nombre para el Balance General">
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Formato">
          <Input />
        </Form.Item>
      </Col>
    </Row>
  </div>
);

const OptionsForm = () => (
  <div>
    <Form.Item>
      <Checkbox>Posee Transferencias Múltiples</Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox>Es cuenta de detracción Banco</Checkbox>
    </Form.Item>
    <Form.Item label="Opciones de Manejo de la Cuenta">
      <Checkbox.Group>
        <Checkbox value="auxiliares">Maneja Auxiliares</Checkbox>
        <Checkbox value="documento">Maneja Documento</Checkbox>
        <Checkbox value="centroCosto">Maneja Centro de Costo</Checkbox>
        <Checkbox value="presupuesto">Maneja Presupuesto</Checkbox>
        <Checkbox value="flujoCaja">Maneja Flujo de Caja</Checkbox>
        <Checkbox value="flujoGastos">Maneja Flujo de Gastos</Checkbox>
        <Checkbox value="territorio">Maneja Territorio</Checkbox>
        <Checkbox value="ordenes">Maneja Ordenes / OT / OS</Checkbox>
        <Checkbox value="pedidos">Maneja Pedidos</Checkbox>
        <Checkbox value="area">Maneja Área</Checkbox>
        <Checkbox value="desactivo">Desactivo</Checkbox>
      </Checkbox.Group>
    </Form.Item>
    <Form.Item>
      <Radio.Group>
        <Radio value="ingreso">Cuenta de Banco Ingreso</Radio>
        <Radio value="egreso">Cuenta de Banco Egreso</Radio>
        <Radio value="ambos">Ambos</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item>
      <Checkbox>No Considerar en Estados de Ganancias</Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox>Mostrar Liquidación de Gastos</Checkbox>
    </Form.Item>
    <Form.Item label="Aplica a factor por">
      <Radio.Group>
        <Radio value="valor">Aplica a factor por valor</Radio>
        <Radio value="peso">Aplica a factor por peso</Radio>
        <Radio value="factura">Aplica a factura invoice</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item>
      <Checkbox>La Cuenta es Variable</Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox>Cuenta para Almacén</Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox>Provisión de Retención</Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox>Ajuste x Diferencia de Cambio</Checkbox>
    </Form.Item>
  </div>
);

const PlanContable = () => {
  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <InputForm />
        </Col>
        <Col span={12}>
          <OptionsForm />
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary">Enviar</Button>
      </Form.Item>
    </Form>
  );
}

export default PlanContable;
