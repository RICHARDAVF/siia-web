import React from 'react';
import { Form, Input, Checkbox, Radio, Row, Col, Button } from 'antd';

const ReporteCuentasPagar = () => {
  return (
    <Form layout="horizontal">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="MES">
            <Checkbox.Group>
              <Checkbox value="apertura">Apertura</Checkbox>
              <Checkbox value="enero">Enero</Checkbox>
              <Checkbox value="febrero">Febrero</Checkbox>
              <Checkbox value="marzo">Marzo</Checkbox>
              <Checkbox value="abril">Abril</Checkbox>
              <Checkbox value="mayo">Mayo</Checkbox>
              <Checkbox value="junio">Junio</Checkbox>
              <Checkbox value="julio">Julio</Checkbox>
              <Checkbox value="agosto">Agosto</Checkbox>
              <Checkbox value="setiembre">Setiembre</Checkbox>
              <Checkbox value="octubre">Octubre</Checkbox>
              <Checkbox value="noviembre">Noviembre</Checkbox>
              <Checkbox value="diciembre">Diciembre</Checkbox>
              <Checkbox value="cierre">Cierre</Checkbox>
              <Checkbox value="dia0">Día 0</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Condición">
            <Radio.Group>
              <Radio value="mensual">Mensual</Radio>
              <Radio value="acumulado">Acumulado</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Reporte">
            <Radio.Group>
              <Radio value="general">General</Radio>
              <Radio value="porCuenta">Por Cuenta</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Vendedor">
            <Checkbox.Group>
              <Checkbox value="codTerritorio">Cod.Territorio</Checkbox>
              <Checkbox value="supervisor">Supervisor</Checkbox>
              <Checkbox value="ubicacion">Ubicacion</Checkbox>
              <Checkbox value="zona">Zona</Checkbox>
              <Checkbox value="categoria">Categoria</Checkbox>
              <Checkbox value="familia">Familia</Checkbox>
              <Checkbox value="xAnalitico">x Analitico</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Centro de Costo">
            <Input.Group>
              <Form.Item label="Desde:">
                <Input />
              </Form.Item>
              <Form.Item label="Hasta:">
                <Input />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Checkbox>Aplicar Cancelación de Documentos</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>No Considerar Ajustes por Diferencia de Cambio</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Modelo de Impresion">
            <Checkbox.Group>
              <Checkbox value="cuentaAuxiliar">Cuenta + Auxiliar</Checkbox>
              <Checkbox value="auxiliarCuenta">Auxiliar + Cuenta</Checkbox>
              <Checkbox value="resumenExcel">Resumen al Excel</Checkbox>
              <Checkbox value="xUbicacion">X Ubicacion</Checkbox>
              <Checkbox value="auxiliar">Auxiliar</Checkbox>
              <Checkbox value="cuentaAuxiliarGlosa">Cuenta + Auxiliar + Glosa</Checkbox>
              <Checkbox value="tamañoCarta">Tamaño Carta</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Filtro de Documentos">
            <Checkbox.Group>
              <Checkbox value="soloFacturas">Solo Facturas</Checkbox>
              <Checkbox value="soloLetras">Solo Letras</Checkbox>
              <Checkbox value="soloLiquidaciones">Solo Liquidaciones</Checkbox>
              <Checkbox value="facturasLiquidacion">Facturas + Liquidacion</Checkbox>
              <Checkbox value="todos">Todos</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <Checkbox>Mostrar Razon Social</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Incluir Protestadas</Checkbox>
          </Form.Item>
          <Form.Item label="Ordenar por">
            <Radio.Group>
              <Radio value="nDocumento">N° Documento</Radio>
              <Radio value="fechaEmision">Fecha de Emision</Radio>
              <Radio value="fechaVencimiento">Fecha de Vencimiento</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Resumen">
            <Checkbox.Group>
              <Checkbox value="documentosVencidos">Documentos Vencidos</Checkbox>
              <Checkbox value="documentosCobrarCliente">Documentos x Cobrar x Cliente</Checkbox>
              <Checkbox value="documentosCobrarVendedor">Documentos x Cobrar x Vendedor</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <Checkbox>Documentos que no van a tener Retención</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Documentos que van a tener Retención</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Solo Mostrar Documentos con Vencimientos del Mes Marcado</Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox>Aumentar 8 días al Vencimiento</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary">Enviar</Button>
      </Form.Item>
    </Form>
  );
};

export default ReporteCuentasPagar;
