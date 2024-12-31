import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import { useLocation } from 'react-router-dom';
import config from '../../../../config';
import { Context } from '../../../../components/GlobalContext';
import endpointsGenerics from '../../../../../api/generics/Endpoints';
import {endpointComprobantes, endpointsCompras} from '../../../../../api/compras/apiCompras';
import dayjs from 'dayjs';
import Loading from '../../../../components/Loading';
import ModalForm from './ModalForm';
import HeaderForm from './HeaderForm';
import TableItemList from './TableItemList';
import { EDIT_COMPROBANTES } from '../../../../../service/urls';

const RegistroComprobantes = () => {
  const [loading, setLoading] = useState(false)
  const [origen, setOrigen] = useState([])
  const [ubicacion, setUbicacion] = useState([])
  const [proveedor, setProveedor] = useState([])
  const [tipoDocument, setTipoDocument] = useState([])
  const [detraccion,setDetraccion] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [centroCostos, setCentroCostos] = useState([])
  const [cuentas, setCuentas] = useState([])
  const [data, setData] = useState([])
  const location = useLocation()
  const [MyForm1] = Form.useForm()
  const [MyForm2] = Form.useForm()
  const { params } = location.state || {}
  const { BASE_URL } = config
  const { token, document, user } = useContext(Context)

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
    
        requestGenerics()
        requestTipoCambio(false)
    if (params.action == "edit") {
      requestDataComprobante()
    }


  }, [])
  const requestDataComprobante=async()=>{
    try{
      setLoading(true)
      const {comprobante,mes,origen} = params.data
      const query_string = `${comprobante}-${mes}-${origen}`
      const url = EDIT_COMPROBANTES(document).replace('codigo',query_string)
      const res = await endpointComprobantes.get(url,token)
      if(res.success){
        const form1 = {...res.data.form_header,
          fecha_contable:dayjs(res.data.form_header.fecha_contable),
          fecha_emision:dayjs(res.data.form_header.fecha_emision),
          fecha_detraccion:dayjs(res.data.form_header.fecha_detraccion),
          fecha_vencimiento:dayjs(res.data.form_header.fecha_vencimiento),
          fecha_referencia:dayjs(res.data.form_header.fecha_referencia),

        }
        
        setData(res.data.table_list)
        MyForm1.setFieldsValue(form1)
      }
      if(res.error){
        message.error(res.error)
      }
    }catch(erro){
      message.error(erro)
    }finally{
      setLoading(false)
    }  
  }
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
        "dates":['origen',"ubicacion","centro-costos","tipo-documento",'detraccion']
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
      setDetraccion(res.detraccion)
    } catch (erro) {
      message.error(erro.toString())
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
      message.error(err.toString())
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

  const saveData = async (values) => {
    try{

      if(Math.abs(haberDolares-debeDolares)!=0){
        return message.error("El haber y debe difieren")
      }
      if(Math.abs(haberSoles-debeSoles)!=0){
        return message.error("El haber y debe difieren")
      }
      var url = `${BASE_URL}/api/v1/compras/save/comprobantes/${document}/`
      if(params.action=="edit"){
        const {mes,comprobante,origen} = params.data
        const query_string = `${comprobante}-${mes}-${origen}`
        url = EDIT_COMPROBANTES(document).replace('codigo',query_string)
      }
      setLoading(true)
      const datos = {
        ...values,
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
      message.error(err.toString())
    }finally{
      setLoading(false)
    }

  }

  const contextHeaderForm = {
    MyForm1,
    saveData,
    origen,
    ubicacion,
    requestProveedor,
    proveedor,
    tipoDocument,
    onCancel,
    requestTipoCambio
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