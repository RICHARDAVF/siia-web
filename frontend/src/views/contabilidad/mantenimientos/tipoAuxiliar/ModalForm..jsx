import { Button, Checkbox, Col, Form, Input, Modal, Row } from "antd";

const ModalForm = (props) => {
    const { onCancel, openModal, saveTipoAuxiliar, myForm } = props

    return (
        <Modal title='Registro de Tipo de Auxiliar'
            open={openModal}
            onCancel={onCancel}
            footer={null}
            width={'60%'}
        >
            <Form onFinish={saveTipoAuxiliar} form={myForm}>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"codigo"} label={"Código"} initialValue={''} rules={[{ required: true, message: 'Obligatorio' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"nombre"} label={"Nombre"} initialValue={''}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name={"correlativo"} valuePropName="checked" initialValue={0}>
                    <Checkbox>Correlativo</Checkbox>
                </Form.Item>
                <Row>
                    <Button onClick={onCancel}>Cancelar</Button>
                    <Button htmlType="submit">Guardar</Button>
                </Row>
            </Form>
        </Modal>
    )
}
export default ModalForm