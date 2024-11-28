import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Table,  Form, Input, DatePicker, InputNumber, Row, Col, message, Select, Spin, Popconfirm } from 'antd';
import { useLocation } from 'react-router-dom';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';
import dayjs from 'dayjs'
import endpointsGenerics from '../../../../api/generics/Endpoints';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../../../components/Loading';
import EndPointContabilidad from '../../../../api/contabilidad/apiAsientos';



const { TextArea } = Input;
const { Option } = Select
const RegistroAsientos = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [auxiliar, setAuxiliar] = useState([])
  const [itemEdit,setItemEdit] = useState(false)
  const [indexItem,setIndexItem] = useState(null)
  const [data, setData] = useState([])
  const [cuentas,setCuentas] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const [origen,setOrigen] = useState([])
  const [tipoAsiento,setTipoAsiento] = useState([])
  const [tipoCambio,setTipoCambio] = useState()
  const { BASE_URL } = config
  const { token, document,user } = useContext(Context)
  const [blockInput,setBlockInput] = useState(false)
  const [vendedor,setVendedor] = useState([])
  const [tipoDocumento,setTipoDocumento] = useState([])
  const [debeSoles,setDebeSoles] = useState(0)
  const [haberSoles,setHaberSoles] = useState(0)
  const [debeDolares,setDebeDolares] = useState(0)
  const [haberDolares,setHaberDolares] = useState(0)
  const [MyForm1] = Form.useForm()
  const [MyForm2] = Form.useForm()
  const fecha = dayjs()
  const {Cuentas,Proveedor,TipoCambio} = endpointsGenerics
  const {Asientos} = EndPointContabilidad
  const location = useLocation()

  const { params } = location.state || {}
  const openModal = () => {
    setOpen(!open)
  }



  useEffect(() => {
    requestGeneric()
    requestTipoCambio()
  }, [])
  const requestGeneric=async()=>{
    try{
      setLoading(true)
      const url = `${BASE_URL}/api/v1/generic/${document}/`
      const datos = {
        "query_string":"",
        "tipo_origen":3,
        "dates":['vendedor',"ubicacion","tipo-documento","tipo-asiento","origen"]
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
      setTipoAsiento(res.tipo_asiento)
      setOrigen(res.origen)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
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
      message.error(err.toString())
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
  const changeCuenta=(option)=>{
    const moneda = option.key.split("-")[1]
    MyForm2.setFieldsValue({
      moneda:moneda,
      haber_soles:0,
      haber_dolares:0,
      debe_soles:0,
      debe_dolares:0
    })
    setBlockInput(moneda)
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
  const add_row=(values)=>{
    const values1 = MyForm1.getFieldsValue()
    const new_values = {
      ...values,"fecha_vencimiento":values.fecha_vencimiento.format("YYYY-MM-DD"),
      "fecha_emision":values1.fecha_emision.format("YYYY-MM-DD"),
      "tipo_cambio":tipoCambio
      
    }
    var newdata  = []
    if(itemEdit && indexItem){
      const new_array = [...data]
      new_array[indexItem] = new_values
       newdata = procces_data(new_array)
    }else{
      const new_array = [...data,new_values]
       newdata = procces_data(new_array)
    }
    setData(newdata)
    setItemEdit(false)
    setIndexItem(null)
    MyForm2.resetFields()
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
  const deleteItem=(index,row)=>{
    const newdata = [...data]
    newdata.splice(index,1)
    const data_new = procces_data(newdata)
    setData(data_new)
  }
  const editItem=(index,row)=>{
    var dates = data[index]
    setItemEdit(true)
    dates.fecha_vencimiento = dayjs(dates.fecha_vencimiento)
    MyForm2.setFieldsValue(dates)
    setIndexItem(index)
    openModal()
      
  }
  const columns = [
    {
      title:"Opcion",
      dataIndex:"opcion",
      key:"opcion",
      render:(_,row,index)=>(
        <Row style={{justifyContent:'space-between'}}>
          <Popconfirm
          title="Eliminar item"
          description= "¿Esta seguro de eliminar?"
          okText="Si"
          onConfirm={()=>deleteItem(index,row)}
          cancelText="No"
          key={index}
          >         
              <FaTrash style={{color:"red",cursor:"pointer"}}/>

          </Popconfirm>
          <Popconfirm
          title="Editar item"
          description= "¿Esta seguro de editar?"
          okText="Si"
          onConfirm={()=>editItem(index,row)}
          cancelText="No"
          key={index}
          >
            <FaEdit style={{color:'green',cursor:'pointer'}}/>
          </Popconfirm>
        </Row>
      )
    },
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
      key:"cuenta"
    },
    {
      title: 'Cliente',
      dataIndex: 'auxiliar',
      key:"auxiliar"
    },
    {
      title: "Vendedor",
      dataIndex: "vendedor",
      key:"vendedor"
    },
    {
      title: "F. Emision",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
    },
    {
      title: 'T.D',
      dataIndex: 'tipo_documento',
      dataIndex: 'tipo_documento',
    },
    {
      title: 'Serie',
      dataIndex: 'serie',
      key:"serie"
    },
    {
      title: 'Numero',
      dataIndex: 'numero',
      key:"numero"
    },
    {
      title: "Moneda",
      dataIndex: "moneda",
    },
    {
      title: "Haber S/",
      dataIndex: "haber_soles",
    },
    {
      title: 'Debe S/',
      dataIndex: 'debe_soles',
    },
    {
      title: 'Haber $',
      dataIndex: 'haber_dolares',
    },
    {
      title: 'Debe $',
      dataIndex: 'debe_dolares',
    },
    {
      title: 'Tipo/Cambio',
      dataIndex: 'tipo_cambio',
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
  const saveData=async(values)=>{
    try{
      if(Math.abs(haberSoles-debeSoles)!=0){
        return message.error("El haber y el debe difieren")
      }
      const url = `${BASE_URL}/api/v1/contabilidad/save/asientos/${document}/`
      setLoading(true)
      const datos = {
        ...values,
        items:data
      }
      const res = await Asientos.post(url,datos,token)
      if(res.success){
        MyForm1.resetFields()
        setData([])
        setHaberDolares(0)
        setHaberSoles(0)
        setDebeDolares(0)
        setDebeSoles(0)
        message.success("Asientos guardados exitosamente")
      }else{
        message.error(res.error)
      }
    }catch(err){
      message.error('Ocurrio un error '+e.toString())
    }finally{
      setLoading(false)
    }
  }
  return (
    <div style={{position:'relative'}}>
      <div>
        <Form
          name='form-asientas-contables'
          className='form-asientos'
          onFinish={saveData}
          layout={'horizontal'}
          form={MyForm1}
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
                  format={'YYYY-MM-DD'}
                  onCalendarChange={(value)=>requestTipoCambio(value)}
                  size={'small'} />
              </Form.Item>
            </Col>
            <Col xs={16} sm={12} md={8}>
              <Form.Item
                name='tipo_asiento'
                label='Tipo de Asiento'
                rules={[{ required: true, message: 'Por favor seleccione asiento' }]}
                initialValue={fecha}
              >
                <Select
                options={tipoAsiento}
                size='small'
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
          <Col xs={20} sm={15} md={10}>
              <Form.Item
                name='observacion'
                label={<span>Obs/Glosa</span>}
                rules={[{ message: 'Por favor  ingrese el numero de deposito' }]}
              >
                <Input
                  size={'small'}
                  placeholder='Observacion'
                />
              </Form.Item>
            </Col>
          <Row>
          <Button onClick={openModal} style={{ background: 'green', color: 'white' }} >
              Agregar
            </Button>
            <Button htmlType='submit' style={{ background: 'blue', color: 'white' }}>
              Guardar
            </Button>   
          </Row>
        </Form>
      </div>
      <Table 
      columns={columns} 
      dataSource={data}
      scroll={{x:'max-content'}} 
      rowKey={(record)=>`${record.serie}-${record.numero}-${record.vendedor}`} />
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
      <Modal
        title="Registros de un nuevo asiento"
        open={open}
        onCancel={openModal}  
        footer={null}
        width={1000}
        style={{ top: 20 }}
        onFinish={add_row}
      >
        <div>
          <Form
            name='form-asientos'
            className='registrar-asientos'
            onFinish={add_row}
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
              <Col xs={12} sm={8} md={8}>
                <Form.Item
                  name="tipo_documento"
                  label="Tipo de documento"
                  rules={[{ required: true, message: "Por favor ingrese el tipo de documento" }]}
                >
                  {/* <Select
                  size='small'
                  showSearch
                  allowClear
                  filterOption={false}
                  >

                  {
                    tipoDocumento.map(item=>(
                      <Option key={item.id} value={item.value}>
                        <div style={{fontSize:9}}>{item.label}</div>
                      </Option>
                    ))
                  }
                  </Select> */}
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
                <Button style={{ background: 'red', color: 'white' }} type='button' id='btn-cancelar' onClick={() => openModal()}>CANCELAR</Button>
              </Col>
              <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                <Button style={{ background: 'blue', color: 'white' }} htmlType='submit' id='bn-agregar' type='submit'>AGREGAR</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
      <Loading status={loading}/>
    </div>
  )
}

export default RegistroAsientos;