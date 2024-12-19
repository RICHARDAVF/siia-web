import { Button, Checkbox, Col, Form, Input, Modal, Radio, Row } from "antd";

const ModalForm = (props) => {
    const { onCancel, openModal, saveCentroCosto } = props

    return (
        <Modal title='Registro de Centro de Costo'
            open={openModal}
            onCancel={onCancel}
            footer={null}
            width={'60%'}
        >

            <Form onFinish={saveCentroCosto}>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"cco_codigo"} label={"Código"} initialValue={''} rules={[{ required: true, message: 'Obligatorio' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name={"cco_nombre"} label={"Nombre"} initialValue={''}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"pla_cuenta"} label={"Cuenta"} initialValue={''}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name={"canterior"} label={"Centro Costo Alternativo"} initialValue={''}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row style={{ marginTop: '-10px' }}>
                    <Checkbox>Aplica a Gastos de Venta</Checkbox>
                </Row>

                <Row style={{ marginTop: '10px' }}>Estado de GG y PP por flujo de Caja:</Row>

                <Radio.Group style={{ display: 'flex', flexDirection: "column" }}>
                    <Radio value={1}>Gastos Directos</Radio>
                    <Radio value={2}>Gastos Indirectos</Radio>
                    <Radio value={3}>Gastos Flujos</Radio>
                </Radio.Group>

                <Row style={{ marginTop: '10px' }}>
                    <Checkbox>Incluye IGV</Checkbox>
                    <Checkbox>Servicio</Checkbox>
                </Row>

                <Row style={{ marginTop: '10px' }}>
                    <Form.Item name={"cuenta_presupuestal"} label={"Cuenta Prosupuestal"}>
                        <Input />
                    </Form.Item>
                </Row>

                <Row style={{ marginTop: '-10px' }}>
                    <Checkbox>Aplica a Presupuesto</Checkbox>
                    <Checkbox>Varios</Checkbox>
                    <Checkbox>Desactivado</Checkbox>
                </Row>
            </Form>

        </Modal >
    )
}
export default ModalForm