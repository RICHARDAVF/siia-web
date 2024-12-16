import { Form, Modal, Row, Col, InputNumber, Input, Select, DatePicker, Button, message } from "antd"
import { useContext, useState } from "react"
import config from "../../../../config"
import { Context } from "../../../../components/GlobalContext"
import endpointsGenerics from "../../../../../api/generics/Endpoints"
const { TextArea } = Input
const { Option } = Select
const ModalFormComponent = (props) => {
    const [blockInput, setBlockInput] = useState(false)
    const [cuentas, setCuentas] = useState([])
    const [auxiliar, setAuixiliar] = useState([])
    const { openModal, onCancel, tipoDocumento, vendedor, addItemList, MyForm2 } = props
    const button_add_edit = 'Guardar'
    const { document, token } = useContext(Context)

    const { BASE_URL } = config
    const { Proveedor } = endpointsGenerics
    const addItem = (values) => {
        const newdata = {...values,fecha_vencimiento:values.fecha_vencimiento.format("YYYY-MM-DD")}
        addItemList(newdata)
    }
    const requestCuentas = async (value) => {
        try {

            const url = `${BASE_URL}/api/v1/generics/list/cuentas/${document}/`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 'query_string': value })
            })

            const result = await response.json()

            if (result.error) {
                message.error(result.error)
            } else {
                setCuentas(result)
            }

        } catch (err) {
            console.log(err)
        }
    }
    const requestAuxiliar = async (value) => {
        try {
            const url = `${BASE_URL}/api/v1/generics/list/proveedor/${document}/`
            const params = {
                'query_string': value
            }
            const res = await Proveedor.post(url, token, params)
            if (res.error) {
                message.error(res.error)
            } else {
                setAuixiliar(res)
            }
        } catch (erro) {

        }
    }
    const clean_input = (value, opt) => {
        if (value == undefined) return;
        if (opt == 3) {
            MyForm2.setFieldsValue({
                "debe_dolares": 0
            })
        } else if (opt == 2) {
            MyForm2.setFieldsValue({
                "haber_dolares": 0
            })
        } else if (opt == 1) {
            MyForm2.setFieldsValue({
                "debe_soles": 0
            })
        } else if (opt == 0) {
            MyForm2.setFieldsValue({
                "haber_soles": 0
            })
        }
    }
    const changeCuenta = (value) => {

        const moneda = value.key.split("-")[1]
        MyForm2.setFieldsValue({
            'moneda': moneda,
            "haber_soles": 0,
            "haber_dolares": 0,
            "debe_soles": 0,
            "debe_dolares": 0
        })
        setBlockInput(moneda)
    }

    return (
        <Modal
            open={openModal}
            onCancel={onCancel}
            title='Registro de un nuevo asiento'
            footer={null}
            width={1000}

        >
            <Form
                name="form-asientos"
                className="registrar-asientos"
                onFinish={addItem}
                layout="vertical"
                form={MyForm2}
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="cuenta"
                            label="Cuenta"
                            rules={[{ required: true, message: "Por favor seleccione una cuenta" }]}
                        >
                            <Select
                                showSearch
                                onSearch={requestCuentas}
                                allowClear
                                filterOption={false}
                                placeholder='Buscar...'
                                size='small'

                                onChange={(_, option) => {

                                    if (option == undefined) {
                                        setBlockInput('')
                                    } else {
                                        changeCuenta(option)
                                    }
                                }}

                            >
                                {cuentas.map(item => (
                                    <Option key={item.id} value={item.value}>
                                        <div key={item.label} style={{ fontSize: 10 }}>
                                            {item.value} - {item.label}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="auxiliar"
                            label="Auxiliar"
                            rules={[{ required: true, message: "Por favor seleccione un auxiliar" }]}
                        >
                            <Select
                                showSearch
                                onSearch={requestAuxiliar}
                                allowClear
                                filterOption={false}
                                placeholder='Buscar...'
                                size='small'


                            >
                                {
                                    auxiliar.map(item => (
                                        <Option key={item.label} value={item.value}>
                                            <div style={{ fontSize: 10 }}>
                                                {item.value} - {item.label}
                                            </div>
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="vendedor"
                            label="Vendedor"
                            rules={[{ required: true, message: "Por favor seleccione un vendedor" }]}
                        >

                            <Select placeholder="Seleccionar vendedor"
                                size='small'

                            >
                                {vendedor.map((vendedor) => (
                                    <Option key={vendedor.value} value={vendedor.value}>
                                        {vendedor.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col xs={12} sm={8} md={8}>
                        <Form.Item
                            name="tipo_documento"
                            label="Tipo de documento"
                            rules={[{ required: true, message: "Por favor ingrese el tipo de documento" }]}
                        >

                            <Select
                                size='small'
                                placeholder='Seleccione un documento'
                                options={tipoDocumento}
                                optionRender={(row) => (
                                    <div style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                                )}
                                showSearch
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Form.Item
                            name="serie"
                            label="Serie"
                            rules={[{ required: true, message: "Por favor ingrese la serie" }]}
                        >
                            <Input maxLength={4} placeholder="Ej: 0012"
                                size='small'

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Form.Item
                            name="numero"
                            label="Número"
                            rules={[{ required: true, message: "Por favor ingrese el número" }]}
                        >
                            <Input maxLength={8} placeholder="Ej: 12345678"
                                size='small'

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Form.Item
                            name="moneda"
                            label="Moneda"
                            rules={[{ required: true, message: "Por favor ingrese la moneda" }]}
                            initialValue={'S'}
                        >
                            <Select
                                size='small'
                                placeholder='Seleccione una moneda'
                                options={[{ id: '1', value: "S", label: "S" }, { id: '2', value: 'D', label: 'D' }]}
                                // defaultValue={'S'}
                                disabled={blockInput != ''}
                                onChange={(e) => setBlockInput(e)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="debe_soles"
                            label="Debe en soles"
                            rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                        >
                            <InputNumber
                                disabled={blockInput == '' ? false : blockInput == 'D'}
                                style={{ width: '100%' }} min={0}
                                size='small'
                                onChange={(value) => clean_input(value, 0)}

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="haber_soles"
                            label="Haber en soles"
                            rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                        >
                            <InputNumber
                                disabled={blockInput == '' ? false : blockInput == 'D'}
                                style={{ width: '100%' }} min={0}
                                size='small'
                                onChange={(value) => clean_input(value, 1)}

                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="debe_dolares"
                            label="Debe en dólares"
                            rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                        >
                            <InputNumber
                                disabled={blockInput == '' ? false : blockInput == 'S'}
                                style={{ width: '100%' }} min={0}
                                size='small'
                                onChange={(value) => clean_input(value, 2)}


                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="haber_dolares"
                            label="Haber en dólares"
                            rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                        >
                            <InputNumber
                                disabled={blockInput == '' ? false : blockInput == 'S'}
                                style={{ width: '100%' }} min={0}
                                size='small'
                                onChange={(value) => clean_input(value, 3)}


                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item
                            name="fecha_vencimiento"
                            label="Fecha de vencimiento"
                            rules={[{ required: true, message: "Por favor seleccione la fecha de vencimiento" }]}
                        >
                            <DatePicker style={{ width: '100%' }}
                                size='small'

                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={16}>
                        <Form.Item
                            name="glosa"
                            label="Glosa"
                            rules={[{ required: true, message: "Por favor ingrese la glosa" }]}
                        >
                            <TextArea rows={2} placeholder="Descripción..."
                                size='small'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ justifyContent: 'end' }}>

                    <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                        <Button style={{ background: 'red', color: 'white' }} type='button' id='btn-cancelar' onClick={() => onCancel()}>Cerrar</Button>
                    </Col>
                    <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                        <Button style={{ background: 'blue', color: 'white' }} htmlType='submit' id='bn-agregar' type='submit'>{button_add_edit}</Button>
                    </Col>
                </Row>
            </Form>

        </Modal>
    )
}

export default ModalFormComponent