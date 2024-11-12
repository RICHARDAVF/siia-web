import React, { useContext, useEffect, useState } from 'react';
import { Space, Modal, Button, Table, Tag, Form, Input, DatePicker, InputNumber, Row, Col, message, Select, Spin,Checkbox } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';

const { TextArea } = Input;
const { Option } = Select
const RegistroComprobantes = () => {
  const [option, setOption] = useState([])
  const [loading, setLoading] = useState(false)
  const [orige,setOrigen] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const [proveedor,setProveedor] = useState([])
  const [tipoDocument,setTipoDocument] = useState([])
  const [open, setOpen] = useState(false)
  const [auxiliar, setAuxiliar] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [data, setData] = useState([])
  const location = useLocation()
  const { params } = location.state || {}
  const { BASE_URL } = config
  const { token, document } = useContext(Context)
  const fecha = new Date()
  const [values, setValues] = useState({
    fecha_contable: `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`,
    fecha_emision: `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`,
  });
  const openModal = () => {
    setOpen(!open)
  }



  useEffect(() => {
    if(params.action=="edit"){
      console.log(params)
    }
    
   
  }, [])
  
  const requestCuentas = async (params) => {
    const url = `${BASE_URL}/api/v1/list/cuenta/${document}/`
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      })
      const res = await response.json()
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const requestAuxiliar = async (value) => {
    const url = ''
    if (!value) {
      setOption([])
      return
    }
    setLoading(true)
    try {
      const response = data.filter(item => item.name.includes(value))
      setAuxiliar(response.map(item => ({
        value: item.key,
        label: item.name
      })))
    } catch (error) {
      console.log(error)
    } finally { setLoading(false) }
  }
  const columns = [
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
    },
    {
      title: "Vendedor",
      dataIndex: "vendedor",
    },
    {
      title: "F. Emision",
      dataIndex: "fecha_emision",
    },
    {
      title: 'T.D',
      dataIndex: 'td',
    },
    {
      title: 'Serie y Numero',
      dataIndex: 'serie_numero',
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
    },
    {
      title: "Haber S/",
      dataIndex: "haber_s",
    },
    {
      title: 'Debe S/',
      dataIndex: 'debe_s',
    },
    {
      title: 'Haber $',
      dataIndex: 'haber_d',
    },
    {
      title: 'Debe $',
      dataIndex: 'debe_d',
    },
    {
      title: 'Glosa',
      dataIndex: 'glosa',
    },
    {
      title: 'F. Venc.',
      dataIndex: 'fecha_vencimiento',
    }
  ]

  return (
    <div>
      <div>
        <Form
          name='form-asientas-contables'
          className='form-asientos'
          onFinish={(values) => console.log(values)}
          layout={"vertical"}
        >
          <Row gutter={6}>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_contable'
                label='Fecha Contable'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'} />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_emision'
                label='Fecha Emision'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'} />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='dias'
                label='Dias'
                rules={[{ required: true, message: 'Ingrese un numero de dia por favor' }]}
              >
                <Input placeholder='Ej:' size='small' />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_vencimiento'
                label='Fecha Vencimiento'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker
                  size={'small'}
                  style={{width:'100%'}}
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='origen'
                label='Origen'
                rules={[{ required: true, message: 'Por favor seleccione un origen' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Buscar..."
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='ubicacion'
                label='Ubicacion'
                rules={[{ required: true, message: 'Por favor seleccione una ubicacion' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Buscar..."
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='detraccion'
                label='Detraccion'
                rules={[{  message: 'Por favor seleccione una ubicacion' }]}
              >
                <Checkbox
                  size={'small'}
                  // checked={true}
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='cuenta_detraccion'
                label='C/Det'
                rules={[{  message: 'Por favor ingrese una cuenta' }]}
              >
                <Input
                  size={'small'}
                  placeholder="Ej:151515"
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_deposito'
                label='F/Dep'
                rules={[{ required:true, message: 'Por favor seleccione lfa fecha de deposito' }]}
              >
                <DatePicker
                  size={'small'}
                  style={{width:'100%'}}
                  
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='numero_deposito'
                label='Nro. Dep.'
                rules={[{ required:true, message: 'Por favor  ingrese el numero de deposito' }]}
              >
                <Input
                  size={'small'}
                  placeholder='Ej:000-153'
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='observacion'
                label={<span>Obs/Glosa</span>}
                rules={[{  message: 'Por favor  ingrese el numero de deposito' }]}
              >
                <TextArea
                  size={'small'}
                  placeholder='Observacion'
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='proveedor'
                label="Proveedor"
                rules={[{  message: 'Por favor  ingrese un proveedor' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Proveedor"
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='tipo_documento'
                label="Tipo Doc."
                rules={[{  message: 'Por favor  seleccione un T.P' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Tipo documento"
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='numero_serie'
                label="Serie"
                rules={[{  message: 'Por favor  ingrese la serie' }]}
              >
                <Input
                  size={'small'}
                  placeholder="Ej:F001"
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='numero_documento'
                label="Nro. Doc."
                rules={[{  message: 'Por favor  ingrese el numero' }]}
              >
                <Input
                  size={'small'}
                  placeholder="Ej:000001"
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
      <Button onClick={openModal} type='primary'>
        Agregar
      </Button>
      <Table columns={columns} dataSource={data} scroll={{x:"max-content"}}  />
      <Modal
        title="Registros un nuevo asiento"
        open={open}
        onOk={openModal}
        onCancel={openModal}
        footer={
          [
            <Button type='primary' danger onClick={openModal}>
              Cancelar
            </Button>,
            <Button type="primary" loading={loading} onClick={openModal}>
              Guardar
            </Button>,
          ]
        }
        width={1000}
      >
        <div>
          <Form
            name='form-asientos'
            className='registrar-asientos'
            onFinish={(values) => console.log(values)}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
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
                    notFoundContent={loading ? <Spin size='small' /> : null}
                  >
                    {option.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
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
                    notFoundContent={loading ? <Spin size='small' /> : null}
                  >
                    {auxiliar.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="vendedor"
                  label="Vendedor"
                  rules={[{ required: true, message: "Por favor seleccione un vendedor" }]}
                >
                  <Select placeholder="Seleccionar vendedor">
                    {vendedores.map((vendedor) => (
                      <Option key={vendedor.value} value={vendedor.value}>
                        {vendedor.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="moneda"
                  label="Moneda"
                  rules={[{ required: true, message: "Por favor ingrese la moneda" }]}
                >
                  <Input maxLength={3} placeholder="Ej: PEN" />
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
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="haber_soles"
                  label="Haber en soles"
                  rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="debe_dolares"
                  label="Debe en dólares"
                  rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="haber_dolares"
                  label="Haber en dólares"
                  rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default RegistroComprobantes;