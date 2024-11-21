import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Popconfirm, InputNumber, Row, Col, message, Select, Spin, Checkbox } from 'antd';
import { useLocation } from 'react-router-dom';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';
import endpointsGenerics from '../../../../api/generics/Endpoints';
import endpointsCompras from '../../../../api/compras/apiCompras';
import dayjs from 'dayjs';
import { FaTrash } from 'react-icons/fa'
import Loading from '../../../components/Loading';
const { TextArea } = Input;
const { Option } = Select
const RegistroComprobantes = () => {
  const [loading, setLoading] = useState(false)
  const [origen, setOrigen] = useState([])
  const [ubicacion, setUbicacion] = useState([])
  const [proveedor, setProveedor] = useState([])
  const [tipoDocument, setTipoDocument] = useState([])
  const [open, setOpen] = useState(false)
  const [centroCostos, setCentroCostos] = useState([])
  const [cuentas, setCuentas] = useState([])
  const [detracion, setDetraccion] = useState(false)
  const [data, setData] = useState([])
  const [blockInput, setBlockInput] = useState('')
  const location = useLocation()
  const [MyForm1] = Form.useForm()
  const [MyForm2] = Form.useForm()
  const { params } = location.state || {}
  const { BASE_URL } = config
  const { token, document, user,updateState } = useContext(Context)

  const fecha = dayjs()
  const { Ubicacion, Proveedor, Document, CentroCostos, Cuentas, TipoCambio } = endpointsGenerics
  const { Compras } = endpointsCompras
  const [tipoCambio, setTipoCambio] = useState()
  const [debeSoles,setDebeSoles] = useState(0)
  const [haberSoles,setHaberSoles] = useState(0)
  const [debeDolares,setDebeDolares] = useState(0)
  const [haberDolares,setHaberDolares] = useState(0)

  const openModal = () => {
    setOpen(!open)
  }



  useEffect(() => {
    if (params.action == "edit") {
    }


    requestGenerics()
    requestTipoCambio(false)

  }, [])
  const requestGenerics = async () => {
    const url = `${BASE_URL}/api/v1/compras/generic/${document}/`
    setLoading(true)
    try {
      const datos = {
        "query_string": "",
        "tipo_origen": 1
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      })
      const res = await response.json()
      setOrigen(res.origen)
      setUbicacion(res.ubicacion)
      setCentroCostos(res.centro_costo)
      setTipoDocument(res.tipo_documento)
    } catch (erro) {
      console.log(erro)
    } finally {
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

  const requestOrigen = async () => {
    setLoading(true)
    try {
      const datos = {
        query_string: '',
        tipo_origen: 1
      }
      const url = `${BASE_URL}/api/v1/generics/list/origen/${document}/`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      })
      const res = await response.json()
      if (res.error) {
        message.error(res.error)
      } else {
        setOrigen(res)
      }
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }
  const requestUbicacion = async () => {
    const url = `${BASE_URL}/api/v1/generics/list/ubicacion/${document}/`
    const res = await Ubicacion.get(url, token)
    if (res.error) {
      message.error(res.error)
    } else {
      setUbicacion(res)
    }
  }
  const deleteItem = (index, row) => {

    const newdata = [...data]
    newdata.splice(index,1)
    const data_new = procces_data(newdata)
    setData(data_new)

  }
  const requestTipoCambio = async (date) => {
    setLoading(true)
    try{

      var  fecha = dayjs(new Date()).format("YYYY-MM-DD")
      if(date){
        fecha = date.format("YYYY-MM-DD")
      }
  
      const url = `${BASE_URL}/api/v1/tipo/cambio/${document}/`
      const datos = {
        "codigo_usuario": user.codigo_usuario,
        "fecha": fecha,
  
      }
  
      const res = await TipoCambio.post(url, token, datos)
      if(res.compra){
        setTipoCambio(res.compra)
        const newdata = procces_data(data)
        setData(newdata)
      }
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  const columns = [
    {
      "title": "Opcion",
      key: 'opcion',
      render: (_, row, index) => (
        <Popconfirm
          title='Eliminar asiento'
          description='¿Esta seguro de eliminar el asiento?'
          okText='Si'
          onConfirm={() => deleteItem(index, row)}
          cancelText='No'
          key={index}
        >
          <FaTrash  style={{color:'red',cursor:'pointer'}} />
        </Popconfirm>
      )
    },
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
      key: 'cuenta',
    },
    {
      title: 'CC',
      dataIndex: 'centro_costo',
      key: 'centro_costo'
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
      key: "moneda",
    },
    {
      title: "Haber S/",
      dataIndex: "haber_soles",
      key: 'haber_soles'
    },
    {
      title: 'Debe S/',
      dataIndex: 'debe_soles',
      key: 'debe_soles'
    },
    {
      title: 'T/C',
      dataIndex: 'tipo_cambio',
      key: 'tipo_cambio'
    },
    {
      title: 'Haber $',
      dataIndex: 'haber_dolares',
      key: 'haber_dolares'
    },
    {
      title: 'Debe $',
      dataIndex: 'debe_dolares',
      key: 'debe_dolares'
    },
    {
      title: 'Glosa',
      dataIndex: 'observacion',
      key: 'observacion'
    },
    {
      title: 'F. Venc.',
      dataIndex: 'fecha_vencimiento',
      key: 'fecha_vencimiento'
    }
  ]
  const requestProveedor = async (query) => {

    const url = `${BASE_URL}/api/v1/generics/list/proveedor/${document}/`
    const params = {
      "query_string": query
    }
    const res = await Proveedor.post(url, token, params)
    if (res.error) {
      message.error(res.error)
    } else {
      setProveedor(res)
    }
  }
  const requestTipoDocument = async () => {
    const url = `${BASE_URL}/api/v1/generics/list/document/${document}/`
    const res = await Document.get(url, token)
    if (res.error) {
      message.error(res.error)
    } else {
      setTipoDocument(res)
    }
  }
  const requestCentroCostos = async () => {
    const url = `${BASE_URL}/api/v1/generics/list/centro-costo/${document}/`
    const res = await CentroCostos.get(url, token)
    if (res.error) {
      message.error(res.error)
    } else {
      setCentroCostos(res)
    }
  }
  const procces_data=(data)=>{
    var haber_soles = 0
    var debe_soles = 0
    var haber_dolares = 0
    var debe_dolares = 0
    const newdata =  data.map((item)=>item.moneda=="D"?{...item,haber_soles:(parseFloat(item.haber_dolares)*parseFloat(tipoCambio)).toFixed(2),
      debe_soles:(parseFloat(item.debe_dolares)*parseFloat(tipoCambio)).toFixed(2),tipo_cambio:tipoCambio
    }:{...item,tipo_cambio:tipoCambio}
    )
    for(var item of newdata){
      haber_soles+=parseFloat(item.haber_soles)
      haber_dolares+=parseFloat(item.haber_dolares)
      debe_soles+=parseFloat(item.debe_soles)
      debe_dolares+=parseFloat(item.debe_dolares)
    }
    setHaberDolares(haber_dolares.toFixed(2))
    setDebeDolares(debe_dolares.toFixed(2))
    setHaberSoles(haber_soles.toFixed(2))
    setDebeSoles(debe_soles.toFixed(2))
    return newdata

  }
  const add_rows = (values) => {

    const values1 = MyForm1.getFieldsValue()
    const fecha_vencimiento = values1.fecha_vencimiento.format("YYYY-MM-DD")
    const observacion = values1.observacion || ''
    const new_values = { ...values, observacion, fecha_vencimiento,tipo_cambio:tipoCambio }
    const new_array = [...data,new_values]

    const newdata = procces_data(new_array)
    setData(newdata)
    MyForm2.resetFields()
  }
  const changeCuenta = (option) => {


    const moneda = option.key.split("-")[1]
    MyForm2.setFieldsValue({
      moneda: moneda,
      haber_soles: 0,
      haber_dolares: 0,
      debe_soles: 0,
      debe_dolares: 0
    })

    setBlockInput(moneda)
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
  const saveData = async (values) => {
    try{

      if(Math.abs(haberDolares-debeDolares)!=0){
        return message.error("El haber y debe difieren")
      }
      if(Math.abs(haberSoles-debeSoles)!=0){
        return message.error("El haber y debe difieren")
      }
      const url = `${BASE_URL}/api/v1/compras/save/comprobantes/${document}/`
      setLoading(true)
      const datos = {
        ...values,
        "detraccion": detracion,
        "codigo_usuario": user.codigo_usuario,
        "codigo_vendedor": user.codigo_vendedor,
        "tipo_asiento": 1,
        'tipo_cambio': user.tipo_cambio,
        "fecha_vencimiento": values.fecha_vencimiento.format("YYYY-MM-DD"),
        "fecha_contable": values.fecha_vencimiento.format("YYYY-MM-DD"),
        "fecha_emision": values.fecha_vencimiento.format("YYYY-MM-DD"),
        "fecha_deposito": values.fecha_vencimiento.format("YYYY-MM-DD"),
        'items': data
      }
      const res = await Compras.post(url, datos, token)
      if (res.success) {
        MyForm1.resetFields()
        setData([])
        setHaberDolares(0)
        setHaberSoles(0)
        setDebeDolares(0)
        setDebeSoles(0)
        return message.success("Comprobante guardado con exito")
      }else{

        message.error(res.error)
      }
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }

  }
  return (
    <div style={{ position: 'relative' }}>
      <div>
        <Form
          name='form-asientas-contables'
          className='form-asientos'
          form={MyForm1}
          layout={"vertical"}
          onFinish={saveData}
        >
          <Row gutter={6}>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_contable'
                label='Fecha Contable'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                initialValue={fecha}
              // format={'YYYY-MM-DD'}
              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'}
                  format={'YYYY-MM-DD'}
                // defaultValue={fecha}
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='fecha_emision'
                label='Fecha Emision'
                rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                initialValue={fecha}
              // format={'YYYY-MM-DD'}

              >
                <DatePicker style={{ width: '100%' }}
                  size={'small'}
                  format={'YYYY-MM-DD'}
                  // defaultValue={fecha}
                  onCalendarChange={(value) => requestTipoCambio(value)}

                />

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
                initialValue={fecha}
              // format={'YYYY-MM-DD'}

              >
                <DatePicker
                  size={'small'}
                  style={{ width: '100%' }}
                  format={'YYYY-MM-DD'}
                // defaultValue={fecha}


                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={8}>
              <Form.Item
                name='origen'
                label='Origen'
                rules={[{ required: true, message: 'Por favor seleccione un origen' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Buscar..."
                  showSearch
                  options={origen}
                  optionRender={(row) => (
                    <div style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                  )}

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
                  showSearch
                  options={ubicacion}
                  optionRender={(row) => (
                    <div style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='detraccion'
                label='Detraccion'
                rules={[{ message: 'Por favor seleccione una ubicacion' }]}
              >
                <Checkbox
                  size={'small'}
                  checked={detracion}
                  onChange={() => setDetraccion(!detracion)}
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='cuenta_detraccion'
                label='C/Det'
                rules={[{ message: 'Por favor ingrese una cuenta' }]}
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
                rules={[{ required: true, message: 'Por favor seleccione lfa fecha de deposito' }]}
                initialValue={fecha}
              >
                <DatePicker
                  size={'small'}
                  style={{ width: '100%' }}
                  format={'YYYY-MM-DD'}
                // defaultValue={fecha}



                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='numero_deposito'
                label='Nro. Dep.'
                rules={[{ required: true, message: 'Por favor  ingrese el numero de deposito' }]}
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
                rules={[{ message: 'Por favor  ingrese el numero de deposito' }]}
              >
                <TextArea
                  size={'small'}
                  placeholder='Observacion'
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={8}>
              <Form.Item
                name='proveedor'
                label="Proveedor"
                rules={[{ message: 'Por favor  ingrese un proveedor' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Proveedor"
                  showSearch
                  onSearch={requestProveedor}
                  allowClear
                  filterOption={false}

                >
                  {
                    proveedor.map(item => (
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
            <Col xs={20} sm={15} md={8}>
              <Form.Item
                name='tipo_documento'
                label="Tipo Doc."
                rules={[{ message: 'Por favor  seleccione un T.P' }]}
              >
                <Select
                  size={'small'}
                  placeholder="Tipo documento"
                  options={tipoDocument}
                  optionRender={(row) => (
                    <div style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                  )}
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col xs={20} sm={15} md={4}>
              <Form.Item
                name='numero_serie'
                label="Serie"
                rules={[{ message: 'Por favor  ingrese la serie' }]}
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
                rules={[{ message: 'Por favor  ingrese el numero' }]}
              >
                <Input
                  size={'small'}
                  placeholder="Ej:000001"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Button onClick={openModal} style={{ background: 'green', color: 'white' }} >
              Agregar
            </Button>
            <Button htmlType='submit' style={{ background: 'blue', color: 'white' }}>
              Guardar
            </Button>
          </Row>

        </Form>
        <Table 
        columns={columns} 
        dataSource={data} scroll={{ x: "max-content" }} rowKey={(record) => `${record.cuenta}-${record.centro_costo}`} />
        <Row gutter={16} style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Col xs={24} sm={12} md={4}>
            <label>HABER S/</label>
            <Input value={haberSoles} />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>DEBE S/</label>
            <Input value={debeSoles} />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>HABER $/</label>
            <Input value={haberDolares} />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>DEBE $/</label>
            <Input value={debeDolares} />
          </Col>
        </Row>
      </div>

      <Modal
      animation={false}
        title="Registros un nuevo asiento"
        open={open}
        onCancel={openModal}
        footer={null}

        width={1000}
      >
        <div>
          <Form
            name='form-asientos'
            className='registrar-asientos'
            form={MyForm2}
            layout="vertical"
            onFinish={add_rows}
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
              <Col xs={24} sm={12} md={6}>
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
              <Col xs={24} sm={12} md={6}>
                <Form.Item
                  name="centro_costo"
                  label="Centro de Costo"
                  rules={[{ required: true, message: "Por favor seleccione una cuenta" }]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder='Buscar...'
                    options={centroCostos}
                    notFoundContent={loading ? <Spin size='small' /> : null}
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
                    style={{ width: '100%' }}
                    min={0}
                    disabled={blockInput == '' ? false : blockInput == 'D'}
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
                    style={{ width: '100%' }}
                    min={0}
                    disabled={blockInput == '' ? false : blockInput == 'D'}
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
                    style={{ width: '100%' }}
                    min={0}
                    disabled={blockInput == '' ? false : blockInput == 'S'}
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
                    style={{ width: '100%' }}
                    min={0}
                    disabled={blockInput == '' ? false : blockInput == 'S'}
                    onChange={(value) => clean_input(value, 3)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ justifyContent: 'end' }}>

              <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                <Button style={{ background: 'red', color: 'white' }} type='button' id='btn-cancelar' onClick={() => openModal()}>CANCELAR</Button>
              </Col>
              <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                <Button style={{ background: 'blue', color: 'white' }} htmlType='submit' id='bn-agregar' type='submit'>AGREGAR</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Loading status={loading} />
    </div>
  )
}

export default RegistroComprobantes;