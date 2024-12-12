import React, { useContext, useEffect, useState } from 'react';
import {  Button, Table,  Form, Input, DatePicker, Row, Col, message, Select,  Popconfirm } from 'antd';
import { useLocation } from 'react-router-dom';
import config from '../../../../config';
import { Context } from '../../../../components/GlobalContext';
import dayjs from 'dayjs'
import endpointsGenerics from '../../../../../api/generics/Endpoints';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../../../../components/Loading';
import EndPointContabilidad from '../../../../../api/contabilidad/apiAsientos';
import ModalForm from './ModalForm';
import TableComponent from './TableComponent';
import { Form1 } from './Form1';




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
  const {Asientos,EditAsientos} = EndPointContabilidad
  const location = useLocation()
  const button_add_edit = itemEdit?'Editar':'Agregar'
  const { params } = location.state || {}
  const openModal = () => {
    setOpen(!open)
  }
  
  
  
  useEffect(() => {
    requestGeneric()
    requestTipoCambio()

    if(params.action=="edit"){
      requestAsientos()
    }
  }, [])
  
  const requestAsientos=async()=>{
    setLoading(true)
    const query_string = params.data
    const url = `${BASE_URL}/api/v1/contabilidad/edit/asientos/${document}/${query_string}/`
    try{
      const response = await EditAsientos.get(url,token)
  
      const header_data = {
        ...response.header,
        'fecha_contable':dayjs(response.header.fecha_contable),
        "fecha_emision":dayjs(response.header.fecha_emision)
      }
      MyForm1.setFieldsValue(header_data)
      setData(response.items)
    }catch(error){
      message.error(error.toString())
    }finally{
      setLoading(false)
    }
  }
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
      "tipo_cambio":tipoCambio,

      
    }
    var newdata  = []
    if(itemEdit){
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
    var dates ={...data[index]}
    setItemEdit(true)
    dates.fecha_vencimiento = dayjs(dates.fecha_vencimiento)
    MyForm2.setFieldsValue(dates)
    setIndexItem(index)
    openModal()
      
  }

  const saveData=async(values)=>{
    try{
      if(Math.abs(haberSoles-debeSoles)!=0){
        return message.error("El haber y el debe difieren")
      }
      const url = `${BASE_URL}/api/v1/contabilidad/save/asientos/${document}/`
      setLoading(true)
      const datos = {
        ...values,
        "fecha_contable":values.fecha_contable.format("YYYY-MM-DD"),
        "fecha_emision":values.fecha_emision.format("YYYY-MM-DD"),
        items:data,
        ...user
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
      <Form1 saveData={saveData} MyForm1={MyForm1} fecha={fecha} tipoAsiento={tipoAsiento} origen={origen} ubicacion={ubicacion} openModal={openModal}/>

       <TableComponent data={data}/>
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
        <ModalForm openModal={openModal} open={open} button_add_edit={button_add_edit} />
      <Loading status={loading} />
    </div>
  )
}

export default RegistroAsientos;