import React, { useContext, useState } from 'react';
import { Button, Form, Modal, Radio, Row, Select, Col, Checkbox, message } from 'antd';



import config from '../../../../config';
import { Context } from '../../../../components/GlobalContext';
import endpointsGenerics from '../../../../../api/generics/Endpoints';
const { Option } = Select
const ModalConfigVentas = ({ open, onCancel, MyForm, onRequestData, origen }) => {
    const { BASE_URL } = config
    const [auxiliar,setAuxiliar] = useState([])
    const {document,token} = useContext(Context)
    const {Proveedor} = endpointsGenerics
    const requestAuxiliar=async(value)=>{
        const url = `${BASE_URL}/api/v1/generics/list/proveedor/${document}/`
        const params = {
            'query_string':value
        }
        const res = await Proveedor.post(url,token,params)
        
        if(res.error){
            message.error(res.error)
        }else{
            setAuxiliar(res)
        }

    }
    return (
        <Modal
            title="Filtros del reporte"
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={null}
        >
            <Form
                form={MyForm}
                onFinish={onRequestData}
            >
                <Row gutter={[16, 16]} style={{ flexWrap: 'wrap' }}>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <Form.Item
                            label="Mes"
                            name={'mes'}
                            initialValue={1}
                        >
                            <Radio.Group>
                                <Radio value={1}>Enero</Radio>
                                <Radio value={2}>Febrero</Radio>
                                <Radio value={3}>Marzo</Radio>
                                <Radio value={4}>Abril</Radio>
                                <Radio value={5}>Mayo</Radio>
                                <Radio value={6}>Junio</Radio>
                                <Radio value={7}>Julio</Radio>
                                <Radio value={8}>Agosto</Radio>
                                <Radio value={9}>Septiembre</Radio>
                                <Radio value={10}>Octubre</Radio>
                                <Radio value={11}>Noviembre</Radio>
                                <Radio value={12}>Diciembre</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Condición" name={'condicion'} initialValue={1}>
                            <Radio.Group>
                                <Radio value={1}>Mensual</Radio>
                                <Radio value={2}>Acumulado</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label='Ordenar Por' name={'ordenamiento'}>
                            <Radio.Group>
                                <Radio value={1}>Comprobante</Radio>
                                <Radio value={2}>Tipo Documento</Radio>
                            </Radio.Group>
                        </Form.Item>
                        
                    
                        <Form.Item label='Origen' name={'origen'} initialValue={''}>
                        <Select
                            options={origen}
                            allowClear
                        />
                    </Form.Item>

                        <Form.Item label='Auxiliar' name={'auxiliar'} initialValue={''}>
                            <Select
                                filterOption={false}
                                showSearch
                                onSearch={requestAuxiliar}
                                allowClear
                            >
                                {auxiliar.map(item=>(
                                    <Option value={item.value} style={{fontSize:10}} key={item.value} >
                                            {item.value}-{item.label}
                                    </Option>

                                ))
                                }

                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item name={'titulo_gratuito'} initialValue={false} valuePropName="checked" style={{ marginBottom: '10px' }}>
                            <Checkbox>Solo titulo Gratuito</Checkbox>
                        </Form.Item>
                        <Form.Item name={'detraccion'} initialValue={false} valuePropName="checked" style={{ marginBottom: '10px' }}>
                            <Checkbox>Detraccion</Checkbox>
                        </Form.Item>
                        <Form.Item name={'desagregado'} initialValue={false} valuePropName="checked" style={{ marginBottom: '10px' }}>
                            <Checkbox>Desagregado</Checkbox>
                        </Form.Item>
                        <Form.Item name={'daot'} initialValue={false} valuePropName="checked" style={{ marginBottom: '10px' }}>
                            <Checkbox>Daot</Checkbox>
                        </Form.Item>
                        <Form.Item name={'transporte'} initialValue={false} valuePropName="checked" style={{ marginBottom: '10px' }}>
                            <Checkbox>Transporte</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>

                <Row style={{ justifyContent: 'end' }}>
                    <Button onClick={() => onCancel()} style={{ background: 'red', color: 'white', fontWeight: 'bold' }} >
                        Cancelar
                    </Button>
                    <Button htmlType="submit" style={{ background: 'blue', fontWeight: 'bold', color: 'white' }}>
                        Cargar
                    </Button>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalConfigVentas;
