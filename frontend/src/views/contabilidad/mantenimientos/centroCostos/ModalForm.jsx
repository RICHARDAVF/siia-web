import { Checkbox, Col, Form, Input, Modal, Radio, Row } from "antd";

const ModalForm = (props) => {
    const { onCancel, openModal } = props

    return (
        <Modal title='Registro de Centro de Costo'
            open={openModal}
            onCancel={onCancel}
            footer={null}
            width={'60%'}
        >

            <Form>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"codigo"} label={"Código"}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name={"nombre"} label={"Nombre"}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col>
                        <Form.Item name={"cuenta"} label={"Cuenta"}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name={"ccAlternativo"} label={"Centro Costo Alternativo"}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row style={{marginTop:'-20px'}}>
                    <Checkbox>Aplica a Gastos de Venta</Checkbox>
                </Row>

                <Row style={{ marginTop: '10px' }}>Estado de GG y PP por flujo de Caja:</Row>

                <Radio.Group style={{ display: 'flex', flexDirection: "column" }}>
                    <Radio>Gastos Directos</Radio>
                    <Radio>Gastos Indirectos</Radio>
                    <Radio>Gastos Flujos</Radio>
                </Radio.Group>

                <Row style={{marginTop:'10px'}}>
                    <Checkbox>Incluye IGV</Checkbox>
                    <Checkbox>Servicio</Checkbox>
                </Row>
                

                <Form.Item name={"cuenta_presupuestal"} label={"Cuenta Prosupuestal"}>
                    <Input />
                </Form.Item>
            </Form>

        </Modal>
    )
}
export default ModalForm