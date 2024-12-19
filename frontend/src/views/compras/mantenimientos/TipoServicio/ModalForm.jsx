import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select } from "antd"

const ModalForm=(props)=>{
    const {openModal,onCancel,saveData,MyForm,modalMode} = props
    const modalTitle = modalMode==0?'Agregar un servicio':'Editar un servicio'
    const button_edit_add = modalMode==0?'Agregar':'Editar'
    return(
        <Modal
        title={modalTitle}
        onCancel={onCancel}
        open={openModal}
        footer={null}
        width={800}
        >
            <Form
            onFinish={saveData}
            form={MyForm}
            layout="vertical"
      
            >
                <Row gutter={6}>
                    <Col xs={16} md={10} lg={6}>
                        <Form.Item
                        label='Codigo'
                        name={'codigo'}
                        rules={[{required:true,message:'Ingrese un codigo'}]}
                        >
                            <Input
                            disabled={modalMode==1}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={14} lg={12}>
                        <Form.Item
                        label='Nombre'
                        name={'nombre'}
                        rules={[{required:true,message:'Ingrese un nombre'}]}

                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col xs={10} md={7} lg={4}>
                        <Form.Item
                        label='Porcetanje'
                        name={'porcentaje'}
                        initialValue={0}
                        >
                            <InputNumber min={0} max={100}
                            placeholder="0.00%"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col xs={16} md={14} lg={10}> 
                        <Form.Item
                        label='C51 Tipo Operacion'
                        name={'c51_tipo_operacion'}
                        initialValue={''}
                        >
                         <Select/>   
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={14} lg={10}> 
                        <Form.Item
                        label='Codigo Adicion PDB'
                        name={'codigo_adicional'}
                        initialValue={''}
                        >
                         <Select/>   
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{justifyContent:'end'}}>
                    <Button onClick={onCancel} 
                    style={{background:'red',cursor:'pointer',color:'white'}}>
                        Cancelar
                    </Button>
                    <Button htmlType="submit" style={{background:'blue',cursor:'pointer',color:'white'}}>
                        {button_edit_add}
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default ModalForm