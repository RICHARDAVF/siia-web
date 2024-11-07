import React, { useContext, useEffect, useState } from 'react';
import { Space, Modal, Button, Table, Tag, Form, Input, DatePicker, InputNumber, Row, Col, message, Select, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';
import dayjs from 'dayjs'



const { TextArea } = Input;
const { Option } = Select
const RegistroAsientos = () => {
  const [option, setOption] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [auxiliar, setAuxiliar] = useState([])
  const [vendedores, setVendedores] = useState([])
  const [data, setData] = useState([])
  const [sizeWindown, setSizeWindow] = useState('horizontal')
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
  const updateLayout = () => {
    if (window.innerWidth < 768) {
      setSizeWindow('vertical');
    } else {
      setSizeWindow('horizontal');
    }
  };

  // Hook para cambiar el layout cuando el tamaño de la ventana cambia
  useEffect(() => {
    updateLayout(); // Detectar el layout inicial
    window.addEventListener('resize', updateLayout); // Escuchar cambios de tamaño de la ventana
    return () => window.removeEventListener('resize', updateLayout); 
  }, []);
  useEffect(() => {
    reqqueastAsientos()
  }, [params])
  const reqqueastAsientos = async (value) => {
    const url = ''
    if (!value) {
      setOption([])
      return
    }
    setLoading(true)
    try {
      const response = data.filter(item => item.name.includes(value))
      setOption(response.map(item => ({
        value: item.key,
        label: item.name
      })))
    } catch (error) {
    } finally { setLoading(false) }
  }
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
          layout={sizeWindown}
        >
          <Row gutter={6}>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='fecha_contable'
                label='Fecha Contable'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'} />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='fecha_emision'
                label='Fecha Emision'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'} />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={4}>
              <Form.Item
                name='dias'
                label='Dias'
                rules={[{ required: true, message: 'Ingrese un numero de dia por favor' }]}
              >
                <Input placeholder='Ej:' size='small' />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='fecha_vencimiento'
                label='Fecha Vencimiento'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              >
                <DatePicker
                  size={'small'}
                />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='ubicaicon'
                label='Ubicacion'
                rules={[{ required: true, message: 'Por favor seleccione una ubicacion' }]}
              >
                <Select
                  size={'small'}
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
      <Button onClick={openModal} type='primary'>
        Agregar
      </Button>
      <Table columns={columns} dataSource={data} />
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
        style={{ top: 20 }}
      >
        <div>
          <Form
            name='form-asientos'
            className='registrar-asientos'
            onFinish={(values) => console.log(values)}
            layout="vertical"
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
              <Col xs={24} sm={12} md={8}>
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
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="fecha_emision"
                  label="Fecha de emisión"
                  rules={[{ required: true, message: "Por favor seleccione la fecha de emisión" }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Item
                  name="tipo_documento"
                  label="Tipo de documento"
                  rules={[{ required: true, message: "Por favor ingrese el tipo de documento" }]}
                >
                  <Input maxLength={4} placeholder="Ej: F001" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Item
                  name="serie"
                  label="Serie"
                  rules={[{ required: true, message: "Por favor ingrese la serie" }]}
                >
                  <Input maxLength={4} placeholder="Ej: 0012" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Item
                  name="numero"
                  label="Número"
                  rules={[{ required: true, message: "Por favor ingrese el número" }]}
                >
                  <Input maxLength={8} placeholder="Ej: 12345678" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6} md={4}>
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

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="tipo_cambio"
                  label="Tipo de cambio"
                  rules={[{ required: true, message: "Por favor ingrese el tipo de cambio" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="fecha_vencimiento"
                  label="Fecha de vencimiento"
                  rules={[{ required: true, message: "Por favor seleccione la fecha de vencimiento" }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="glosa"
                  label="Glosa"
                  rules={[{ required: true, message: "Por favor ingrese la glosa" }]}
                >
                  <TextArea rows={2} placeholder="Descripción..." />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default RegistroAsientos;