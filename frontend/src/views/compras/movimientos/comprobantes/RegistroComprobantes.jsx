import React, { useContext, useEffect, useRef, useState } from 'react';
import { Modal, Button, Table, Form, Input, DatePicker, Popconfirm, InputNumber, Row, Col, message, Select, Spin, Checkbox } from 'antd';
import { useLocation } from 'react-router-dom';
import config from '../../../../config';
import { Context } from '../../../../components/GlobalContext';
import endpointsGenerics from '../../../../../api/generics/Endpoints';
import {endpointsCompras} from '../../../../../api/compras/apiCompras';
import dayjs from 'dayjs';
import { FaTrash } from 'react-icons/fa'
import Loading from '../../../../components/Loading';
import ModalForm from './ModalForm';
import HeaderForm from './HeaderForm';
import TableItemList from './TableItemList';

const RegistroComprobantes = () => {
  const [loading, setLoading] = useState(false)
  const [origen, setOrigen] = useState([])
  const [ubicacion, setUbicacion] = useState([])
  const [proveedor, setProveedor] = useState([])
  const [tipoDocument, setTipoDocument] = useState([])
  const [openModal, setOpenModal] = useState(false)
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
  const { token, document, user } = useContext(Context)

  const fecha = dayjs()
  const {  Proveedor, Cuentas, TipoCambio } = endpointsGenerics
  const { Compras } = endpointsCompras
  const [tipoCambio, setTipoCambio] = useState(0)
  const [debeSoles,setDebeSoles] = useState(0)
  const [haberSoles,setHaberSoles] = useState(0)
  const [debeDolares,setDebeDolares] = useState(0)
  const [haberDolares,setHaberDolares] = useState(0)
  useEffect(()=>{
    window.document.title = 'Registro de comprobantes'
  })



  useEffect(() => {
    if (params.action == "edit") {
    }


    requestGenerics()
    requestTipoCambio(false)

  }, [])
  const onCancel = () => {
    setOpenModal(!openModal)
  }

  const requestGenerics = async () => {
    const url = `${BASE_URL}/api/v1/generic/${document}/`
    setLoading(true)
    try {
      const datos = {
        "query_string": "",
        "tipo_origen": 1,
        "dates":['origen',"ubicacion","centro-costos","tipo-documento"]
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



  const deleteItem = (id) => {
    const index = data.findIndex(item=>item.id==id)
    if(index!==-1){
      const newdata = [...data]
      newdata.splice(index,1)
      const data_new = procces_data(newdata)
      setData(data_new)
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
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

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
  const addItem = (values) => {

    const values1 = MyForm1.getFieldsValue()
    const fecha_vencimiento = values1.fecha_vencimiento.format("YYYY-MM-DD")
    const observacion = values1.observacion || ''
    const id = data.length || 0
    const new_values = { 
      "id":id,
      ...values, 
      observacion, fecha_vencimiento,tipo_cambio:tipoCambio }
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
  const editItem=async()=>{
    onCancel()
  }
  const contextHeaderForm = {
    MyForm1,
    saveData,
    origen,
    ubicacion,
    requestProveedor,
    proveedor,
    tipoDocument,
    onCancel
  }
  const contextModal = {
    openModal,
    addItem,
    MyForm2,
    requestCuentas,
    cuentas,
    centroCostos,
    onCancel
  }
  const contextTableItem={
    data,
    deleteItem
  }
  return (
    <div style={{ position: 'relative' }}>
      <div>
        <HeaderForm {...contextHeaderForm}/>
        <TableItemList {...contextTableItem}/>
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
      <ModalForm {...contextModal}/>
      <Loading status={loading} />
    </div>
  )
}

export default RegistroComprobantes;