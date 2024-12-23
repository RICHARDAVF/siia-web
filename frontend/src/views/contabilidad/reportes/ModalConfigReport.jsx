import React, { useState } from 'react';
import { Button, Form, Modal,  Radio, Row, Select } from 'antd';

const ModalConfigReport = ({ open, onCancel,MyForm,onRequestData,origen}) => {

    return (
        <Modal
            title="Filtros del reporte"
            open={open}
            onCancel={onCancel}
            width={600}
            footer={null}
        >
            <Form 
            form={MyForm}
            onFinish={onRequestData}
            >
                <Form.Item
                label="Mes"
                name={'mes'}
                >
                    <Radio.Group>
                        <Radio value={1}>Enero</Radio>
                        <Radio value={2}>Febrero</Radio>
                        <Radio value={3}>Marzo</Radio>
                        <Radio value={4}>Abril</Radio>
                        <Radio value={5}>Mayo</Radio>
                        <Radio value={6}>Junio</Radio>
                        <Radio value={7}>Julio</Radio>
                        <Radio value={8}>Agostot</Radio>
                        <Radio value={9}>Septiembre</Radio>
                        <Radio value={10}>Octubre</Radio>
                        <Radio value={11}>Noviembre</Radio>
                        <Radio value={12}>Diciembre</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Condición" name={'condicion'}>
                        <Radio.Group >
                            <Radio value={1}>Mensual</Radio>
                            <Radio value={2}>Acumulado</Radio>
                        </Radio.Group>
                    
                </Form.Item>
                <Form.Item label='Order Por' name={'ordernamiento'}>
                    <Radio.Group >
                        <Radio value={1}>Mensual</Radio>
                        <Radio value={2}>Acumulado</Radio>
                    </Radio.Group>

                </Form.Item>
                <Form.Item label='Origen' name={'origen'}>
                    <Select
                        options={origen}
                    />
                </Form.Item>
                <Row style={{justifyContent:'end'}}>
                    <Button  onClick={()=>onCancel()} style={{background:'red',color:'white',fontWeight:'bold'}} >
                        Cancelar
                    </Button>
                    <Button htmlType="submit" style={{background:'blue',fontWeight:'bold',color:'white'}}>
                        Guardar
                    </Button>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalConfigReport;
