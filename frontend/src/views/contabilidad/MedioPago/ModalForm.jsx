import { Button, Col, Form, Input, Modal, Radio, Row, Select } from "antd"

const ModalForm=({modalMode,onCancel,openModal,MyForm})=>{
    const titleModal = modalMode==0?'Agregar Medio de Pago':'Editar Medio de Pago'
    return(
        <Modal
        title={titleModal}
        open={openModal}
        onCancel={onCancel}
        footer={null}
        width={900}
        >
            <Form>
                <Row gutter={10}>
                    <Col xs={16} md={10} lg={6}>
                        <Form.Item
                            label='Codigo'
                            name='codigo'
                            rules={[{required:true,message:'Ingrese un codigo'}]}
                            
                        >
                            <Input size="small"/>
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={12} lg={8}>
                        <Form.Item
                            label='Nombre'
                            name='nombre'
                            rules={[{required:true,message:'Ingrese un nombre'}]}
                        >
                            <Input size="small"/>
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={12} lg={8}>
                        <Form.Item
                            label='Tabla'
                            name='tabla'
                            initialValue={''}
                        >
                            <Select size="small"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Form.Item
                    name={'grupo'}
                    label={'Grupo'}
                    initialValue={0}
                    >
                        <Radio.Group>
                            <Radio value={1}>ITF,pago IGV,Pago Renta,Pago AFP</Radio>
                            <Radio value={2}>Trasnferencia de Bancos</Radio>
                            <Radio value={3}>Pago de proveedor</Radio>
                            <Radio value={4}>Prestamo al personal</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Row>
                <Row style={{justifyContent:'end'}}>
                    <Button>Cancelar</Button>
                    <Button>Agregar</Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default ModalForm