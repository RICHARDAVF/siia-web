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


                <Form.Item style={{ marginTop: '-30px' }} name={"cco_aplica"} valuePropName="checked" initialValue={0}>
                    <Checkbox>Aplica a Gastos de Venta</Checkbox>
                </Form.Item>

                <Row>Estado de GG y PP por flujo de Caja:</Row>

                <Form.Item initialValue={0} name={"cco_eegg01"}>
                    <Radio.Group style={{ display: 'flex', flexDirection: "column" }}>
                        <Radio value={1}>Gastos Directos</Radio>
                        <Radio value={2}>Gastos Indirectos</Radio>
                        <Radio value={3}>Gastos Flujos</Radio>
                    </Radio.Group>
                </Form.Item>

                <Row>
                    <Form.Item name={"cco_incigv"} valuePropName="checked" initialValue={0}>
                        <Checkbox>Incluye IGV</Checkbox>
                    </Form.Item>

                    <Form.Item name={"cco_servi"} valuePropName="checked" initialValue={0}>
                        <Checkbox>Servicio</Checkbox>
                    </Form.Item>
                </Row>

                <Row>
                    <Col>
                        <Form.Item name={"pre_scta"} label={"Cuenta Prosupuestal"} initialValue={''}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Form.Item name={"cco_presup"} valuePropName="checked" initialValue={0}>
                        <Checkbox>Aplica a Presupuesto</Checkbox>
                    </Form.Item>

                    <Form.Item name={"cco_activo"} valuePropName="checked" initialValue={0}>
                        <Checkbox>Descuento</Checkbox>
                    </Form.Item>

                    <Form.Item name={"cco_varios"} valuePropName="checked" initialValue={0}>
                        <Checkbox>Varios</Checkbox>
                    </Form.Item>
                </Row>

                <Row>
                    <Button onClick={onCancel}>Cancelar</Button>
                    <Button htmlType="submit">Guardar</Button>
                </Row>

            </Form>

        </Modal >
    )
}
export default ModalForm