import { Modal, Form, Row, Col, InputNumber, Input, Checkbox, Button, Select, Radio,message } from "antd"
import { useEffect, useState } from "react"
import endpointsGenerics from '../../../../../api/generics/Endpoints'

const { Option } = Select
export const ModalForm = (props) => {
    const [checkeds, setCheckeds] = useState([])

    const { titleModal, openModal, onCancel, MyForm, titleMode, onFinish,TablaCont,requestTablas } = props

    const btnValue = titleMode == 0 ? 'Agregar' : 'Editar'
    useEffect(() => {
        if (titleMode == 0) {
            MyForm.resetFields()
        }
    }, [])
  
    const fields1 = [
        {
            label: 'Dia 1',
            name: 'dia1'
        },
        {
            label: 'Dia 2',
            name: 'dia2'
        },
        {
            label: 'Dia 3',
            name: 'dia3'
        },
        {
            label: 'Dia 4',
            name: 'dia4'
        },
        {
            label: 'Dia 5',
            name: 'dia5'
        },
        {
            label: 'Dia 6',
            name: 'dia6'
        },
        {
            label: 'Dia 7',
            name: 'dia7'
        },
        {
            label: 'Dia 8',
            name: 'dia8'
        },
        {
            label: 'Dia 9',
            name: 'dia9'
        },
        {
            label: 'Dia 10',
            name: 'dia10'
        }
    ]
    const fields2 = [
        {
            label: 'No considera Ventas',
            name: 'no_considera_ventas',
        },
        {
            label: 'No Valida credito',
            name: 'no_valida_credito',
        },
        {
            label: 'Visualizar en tienda',
            name: 'visualizar_tienda',
        },
        {
            label: 'Aprobacion Automatica',
            name: 'aprobacion_automatica',
        },
        {
            label: 'Titulo Gratutio',
            name: 'titulo_gratuito',
        },
        {
            label: 'Activo',
            name: 'activo'
        }
    ]
    const fields3 = [
        {
            label: 'Descuento Unico',
            name: 'descuento_unico',
        },
        {
            label: 'Adelanto',
            name: 'adelanto',
        },
        {
            label: 'Agrupa Credito',
            name: 'agrupa_credito',
        },
        {
            label: 'Recojo Compras',
            name: 'recojo_compras',
        },

    ]
    const handleCheckboxChange = (name, isChecked) => {
        if (isChecked) {
            setCheckeds([...checkeds, name]);
        } else {
            setCheckeds(checkeds.filter(item => item !== name))
        }
    };
 
    return (
        <Modal
            title={titleModal}
            open={openModal}
            onCancel={onCancel}
            width={1000}
            footer={null}
        >

            <Form
                name="form-condicion-pago"
                className="condicion-pago"
                layout="vertical"
                form={MyForm}
                onFinish={onFinish}
            >
                <Row gutter={8}>
                    <Col xs={8} md={4} lg={3}>
                        <Form.Item
                            label="Codigo"
                            name={'codigo'}
                            rules={[{ required: true, message: 'Ingrese un codigo' }]}
                        >
                            <Input disabled={titleMode==1} />
                        </Form.Item>
                    </Col>
                    <Col xs={16} md={12} lg={6}>
                        <Form.Item
                            label="Nombre"
                            name={'nombre'}
                            rules={[{ required: true, message: 'Ingrese un nombre' }]}
                        >
                            <Input  />
                        </Form.Item>
                    </Col>

                    <Col xs={16} md={12} lg={6}>
                        <Form.Item
                            label='Tabla'
                            name={'tabla'}
                            initialValue={''}
                        >
                            <Select 
                                showSearch 
                                onSearch={requestTablas} 
                                allowClear
                                filterOption={false} 
                                > 
                                    {TablaCont.map((row, index) => (
                                        <Option key={index} value={row.value}> 
                                            <div style={{ fontSize: 10 }}> 
                                                {row.value} - {row.label} 
                                            </div> </Option>
                                        ))} 
                            </Select>

                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label='Descuento'
                            name={'descuento'}
                            initialValue={0}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={8} lg={4}>
                        <Form.Item
                            label="N° Letras"
                            name={'cantidad_letras'}
                            initialValue={0}
                        >
                            <InputNumber />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>

                    {fields1.map((field, index) => (
                        <Form.Item
                            key={index}
                            label={field.label}
                            name={field.name}
                            initialValue={0}
                        >
                            <InputNumber style={{ width: '80px' }} />
                        </Form.Item>))
                    }

                </Row>
                <Row gutter={4}>
                    <Col>
                        <Form.Item
                            label='Tipo Pago'
                            name={'tipo_pago'}
                            initialValue={''}
                        >
                            <Select
                                size="small"
                                placeholder={'Ninguna'}
                                allowClear
                                options={[{ value: 'CO', label: 'Contado' }, { value: 'CR', label: 'Crédito' }]}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label='Tipo Documento'
                            name={'tipo_documento'}
                            initialValue={''}
                        >
                            <Select
                                size="small"
                                placeholder={'Ninguna'}
                                allowClear
                                options={[{ value: 'F', label: 'Factura' }, { value: 'B', label: 'Boleta' }]}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Row style={{ borderWidth: 3, borderColor: 'black', borderStyle: 'solid', padding: 2, borderRadius: 5 }}>
                            <Form.Item name={'estado'}
                            initialValue={0}
                             >
                                <Radio.Group>
                                    <Radio value={1}>Todos</Radio>
                                    <Radio value={2}>Compras Nacionales</Radio>
                                    <Radio value={3}>Compras de Importación</Radio>
                                    <Radio value={4}>Ventas</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                    <Col style={{ width: '49%', borderRadius: 5, padding: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderStyle: 'solid' }}>

                        {fields2.map((item, index) => (

                            <Form.Item key={index}
                                name={item.name} 
                                labelCol={{ span: 0 }} 
                                wrapperCol={{ span: 40 }} 
                                valuePropName="checked"
                                initialValue={false}
                                >
                                <Checkbox
                                    checked={checkeds.includes(item.name) ||item.value }
                                    onChange={e => handleCheckboxChange(item.name, e.target.checked)}
                              
                                >
                                    {item.label}
                                </Checkbox>
                            </Form.Item>
                        ))}

                    </Col>
                    <Col style={{ width: '49%', borderRadius: 5, padding: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderStyle: 'solid' }}>

                        {fields3.map((item, index) => (

                            <Form.Item 
                                key={index} 
                                name={item.name} 
                                labelCol={{ span: 0 }} 
                                wrapperCol={{ span: 40 }}
                                valuePropName="checked"
                                initialValue={false}

                                  >
                                <Checkbox
                                    checked={checkeds.includes(item.name) || item.value }
                                    onChange={e => handleCheckboxChange(item.name, e.target.checked)} 
                                    
                                    >
                                    {item.label}

                                </Checkbox>
                            </Form.Item>
                        ))}
                    </Col>

                </Row>
                <Row style={{ marginTop: 5, justifyContent: 'end' }}>
                    <Button onClick={onCancel}
                        style={{ marginRight: 2, background: 'red', color: 'white' }}>
                        Cerrar
                    </Button>
                    {(titleMode == 0 || titleMode == 1) &&

                        <Button htmlType='submit'
                            style={{ marginRight: 2, background: 'blue', color: 'white' }}>
                            {btnValue}
                        </Button>

                    }
                </Row>
            </Form>

        </Modal>
    )
}