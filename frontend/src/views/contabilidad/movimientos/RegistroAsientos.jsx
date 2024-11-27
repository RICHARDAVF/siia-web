import React, { useContext, useEffect, useState } from 'react';
import { Space, Modal, Button, Table,  Form, Input, DatePicker, InputNumber, Row, Col, message, Select, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';
import dayjs from 'dayjs'
import endpointsGenerics from '../../../../api/generics/Endpoints';



const { TextArea } = Input;
const { Option } = Select
const RegistroAsientos = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [auxiliar, setAuxiliar] = useState([])
  const [data, setData] = useState([])
  const [cuentas,setCuentas] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const { BASE_URL } = config
  const { token, document } = useContext(Context)
  const [blockInput,setBlockInput] = useState(false)
  const [vendedor,setVendedor] = useState([])
  const [tipoDocumento,setTipoDocumento] = useState([])
  const fecha = dayjs()
  const {Cuentas,Proveedor} = endpointsGenerics
  const location = useLocation()
  const { params } = location.state || {}
  const openModal = () => {
    setOpen(!open)
  }



  useEffect(() => {
    requestGeneric()
  }, [])
  const requestGeneric=async()=>{
    try{
      setLoading(true)
      const url = `${BASE_URL}/api/v1/generic/${document}/`
      const datos = {
        "query_string":"",
        "tipo_origen":1,
        "dates":['vendedor',"ubicacion","tipo-documento"]
      }
      const response = await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify(datos)
      })
      const res = await response.json()
      setUbicacion(res.ubicacion)
      setVendedor(res.vendedor)
      setTipoDocumento(res.tipo_documento)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  const requestCuentas = async (params) => {
    const url = `${BASE_URL}/api/v1/generics/list/cuentas/${document}/`
    const datos = {
      'query_string': params
    }
    const res = await Cuentas.post(url, token, datos)
    if (res.error) {
      message.error(res.error)
    } else {
      setCuentas(res)
    }
  }
  const changeCuenta=(val)=>{

  }
  const requestAuxiliar = async (query) => {
    const url = `${BASE_URL}/api/v1/generics/list/proveedor/${document}/`
    const params = {
      "query_string": query
    }
    const res = await Proveedor.post(url, token, params)
    if (res.error) {
      message.error(res.error)
    } else {
      setAuxiliar(res)
    }
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
          layout={'horizontal'}
        >
          <Row gutter={6}>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='fecha_contable'
                label='Fecha Contable'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                initialValue={fecha}
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
                initialValue={fecha}
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
                initialValue={fecha}
              >
                <DatePicker
                  size={'small'}
                />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='ubicacion'
                label='Ubicacion'
                rules={[{ required: true, message: 'Por favor seleccione una ubicacion' }]}
              >
                <Select
                  options={ubicacion}
                  size={'small'}
                />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </div>
      <div>

      <Button size='small' onClick={openModal} style={{background:'blue',color:'white'}} >
        AGREGAR
      </Button>
      <Button size='small' onClick={openModal} style={{background:'green',color:'white'}}>
        GUARDAR
      </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Registros de un nuevo asiento"
        open={open}
        onOk={openModal}
        onCancel={openModal}
      
        footer={
          [
            <Button key={"button1"} type='primary' danger onClick={openModal}>
              Cancelar
            </Button>,
            <Button  key={'button2'} type="primary" loading={loading} onClick={openModal}>
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
                    size='small'
                    notFoundContent={loading ? <Spin size='small' /> : null}
                    onChange={(_, option) => {

                      if (option == undefined) {
                        setBlockInput('')
                      } else {
                        changeCuenta(option)
                      }
                    }}

                  >
                    {cuentas.map(item => (
                      <Option key={item.value + '-' + item.moneda} value={item.value}>
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

                    notFoundContent={loading ? <Spin size='small' /> : null}
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
              <Col xs={12} sm={6} md={6}>
                <Form.Item
                  name="tipo_documento"
                  label="Tipo de documento"
                  rules={[{ required: true, message: "Por favor ingrese el tipo de documento" }]}
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
              <Col xs={12} sm={6} md={6}>
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
                  <InputNumber style={{ width: '100%' }} min={0} 
                    size='small'
                  
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="haber_soles"
                  label="Haber en soles"
                  rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} 
                    size='small'
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="debe_dolares"
                  label="Debe en dólares"
                  rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} 
                    size='small'
                  
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="haber_dolares"
                  label="Haber en dólares"
                  rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} 
                    size='small'
                  
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
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default RegistroAsientos;