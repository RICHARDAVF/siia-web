import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from "antd"
const {Option}=Select
const ModalForm=({MyForm,titleModal,openModal,onCancel,modalMode,saveData,cuentas})=>{
    const btn_add_edit = modalMode==1?'Editar':'Agregar'
    return (
        <Modal
        title={titleModal}
        open={openModal}
        onCancel={onCancel}
        width={900}
        footer={null}
        >
            <Form
            form={MyForm}
            onFinish={saveData}
            >
                <Row gutter={10}>
                    <Col xs={16} md={12} lg={8}>
                        <Form.Item
                        label={'Codigo'}
                        name={'codigo'}
                        >
                            <Input
                            placeholder="00"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={14} lg={12}>
                        <Form.Item
                        label={'Nombre'}
                        name={'nombre'}
                        >
                            <Input
                            placeholder="Ingrese un nombre"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Form.Item
                    name={'tipo_origen'}
                    label={'Asignado a:'}
                    >
                        <Radio.Group>
                            <Radio value={1}>Compras</Radio>
                            <Radio value={2}>Caja</Radio>
                            <Radio value={3}>Contabilidad</Radio>
                            <Radio value={4}>Retención</Radio>
                            <Radio value={5}>Retención (Clientes)</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Row>
                <Row>
                    <Col>
                        <Form.Item
                        name={'tipo_caja'}
                        label={'Tipo Caja'}
                        initialValue={0}
                        >
                            <Radio.Group>
                                <Radio value={1}>Ingreso</Radio>
                                <Radio value={2}>Egreso</Radio>
                                <Radio value={3}>rendición</Radio>
                        
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                        name={'libro'}
                        label={'Libro'}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                        name={'correlativo'}
                        label={'Correlativo'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Item
                            name={'ventas'}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox
                            >
                                Para Ventas
                            </Checkbox>

                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            name={'recibo_honorarios'}
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox
                            >
                                Recibo por honorarios
                            </Checkbox>

                        </Form.Item>
                    </Col>
                    <Col xs={16} md={12} lg={14}>
                        <Form.Item
                            name={'cuenta'}
                            label={'Cuentas para cerrar Asiento de caja'}
                        >
                            <Select
                            allowClear
                            >
                                {
                                    cuentas.map((item,index)=>(
                                        <Option key={`${item.id}-${index}`}
                                        value={item.value}
                                        >
                                            <div style={{fontSize:10}}>
                                                {item.value}-{item.label}
                                            </div>

                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{justifyContent:'end'}}>
                    <Button style={{background:'red',color:'white'}} onClick={()=>onCancel(0)}>
                        Cancelar
                    </Button>
                    <Button htmlType="submit" style={{color:'white',background:'blue'}} >
                        {btn_add_edit}
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default ModalForm