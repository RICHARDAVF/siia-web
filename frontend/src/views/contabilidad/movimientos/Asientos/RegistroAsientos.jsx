import {useContext, useEffect, useState } from "react";
import FormHeaderComponent from "./FormHeaderComponent";
import endpointsGenerics from "../../../../../api/generics/Endpoints";
import { Context } from "../../../../components/GlobalContext";
import { message,Row,Col,Input,Form } from "antd";
import ModalFormComponent from "./ModalFormComponent";
import TableComponent from "./TableComponent";
import config from "../../../../config";
import dayjs from 'dayjs'
import EndPointContabilidad from "../../../../../api/contabilidad/apiAsientos";
import Loading from "../../../../components/Loading";
import { useLocation } from "react-router-dom";
import { EDIT_ASIENTOS } from "../../../../../service/urls";
const RegistroAsientos=()=>{
  const [tipoAsiento,setTipoAsiento] = useState([])
  const [loading,setLoading] = useState(false)
  const [origen,setOrigen] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const [tipoDocumento,setTipoDocumento] = useState([])
  const [vendedor,setVendedor] = useState([])
  const [openModal,setOpenModal] = useState(false) 
  const {document,token,user} = useContext(Context)
  const [haberSoles,setHaberSoles] = useState(0)
  const [haberDolares,setHaberDolares] = useState(0)
  const [debeSoles,setDebeSoles] = useState(0)
  const [debeDolares,setDebeDolares] = useState(0)
  const [tipoCambio,setTipoCambio] = useState(0)
  const [idEdit,setIdEdit] = useState(-1)
  const [data,setData] = useState([])
  const [MyForm1] = Form.useForm()
  const [MyForm2] = Form.useForm()
  const {BASE_URL} = config
  const {TipoCambio} = endpointsGenerics
  const {Asientos} = EndPointContabilidad
  const location = useLocation()
  const {params} = location.state || {}

  useEffect(()=>{
    requestManyData()
    requestTipoCambio(false)
    if(params.action=='edit' ){
      requestAsientos(params)
     
    }
  },[])
  const onCancel=()=>{
    setOpenModal(!openModal)
  }

  const requestAsientos=async(params)=>{
    try{
      setLoading(true)
  
      const {comprobante,mes} = params.data
      const query_string = `${comprobante}-${mes}-${params.data.origen}`
      const url = EDIT_ASIENTOS(document).replace('codigo',query_string)
      const res = await Asientos.get(url,token)
      if(res.success){
        const form_header = {
          ...res.data.form_header,
          'fecha_contable':dayjs(res.data.form_header.fecha_contable),
          'fecha_emision':dayjs(res.data.form_header.fecha_contable),
        }
        
        
        MyForm1.setFieldsValue(form_header)
        setTimeout(()=>{
        suma_haber_debe(res.data.list_table)
        setData(res.data.list_table)
        },500)
         
        
      }
      if(res.error){
        message.error(res.error)
       
      }
    }catch(err){
      message.error(err.toString())
      
    }finally{
      setLoading(false)
    }
  }
  const requestManyData=async()=>{
    try{
      setLoading(true)
      const datos = {
        'query_string':'',
        'tipo_origen':3,
        'dates':['tipo-documento','tipo-asiento','origen','ubicacion','vendedor']
      }
      const response = await endpointsGenerics.ManyData.post(document,token,datos)
      if(response.error){
        message.error(response.error)
      }
      setTipoAsiento(response.tipo_asiento)
      setOrigen(response.origen)
      setTipoDocumento(response.tipo_documento)
      setUbicacion(response.ubicacion)
      setVendedor(response.vendedor)
      
    }catch(err){
      message.error(true)
    }finally{
      setLoading(false)
    }
  }
  const requestTipoCambio=async(date)=>{
  
    try{
      var fecha = dayjs(new Date()).format("YYYY-MM-DD")
      if(date){
        fecha = date.format('YYYY-MM-DD')
      }
      const url = `${BASE_URL}/api/v1/tipo/cambio/${document}/`
      const datos = {
        "codigo_usuario":user.codigo_usuario,
        "fecha":fecha
      }
      const res = await TipoCambio.post(url,token,datos)
      if(res.compra){
        setTipoCambio(res.compra)
        const newdata = data.map(item=>{
          return{
            ...item,
            tipo_cambio:res.compra
          }
        })
        const newdata1 = change_tipo_cambio(newdata)
        const newdata2 = suma_haber_debe(newdata1)
        setData(newdata2)
      }
    }catch(erro){
      message.error(erro.toString())
    }finally{
      setLoading(false)
    }
  }
  const suma_haber_debe=(data)=>{
    var haber_soles = 0
    var haber_dolares = 0
    var debe_soles = 0
    var debe_dolares = 0
    for(var item of data){
      haber_soles+=parseFloat(item.haber_soles)
      haber_dolares+=parseFloat(item.haber_dolares)
      debe_soles+=parseFloat(item.debe_soles)
      debe_dolares+=parseFloat(item.debe_dolares)
    }
    setDebeDolares(debe_dolares.toFixed(2))
    setDebeSoles(debe_soles.toFixed(2))
    setHaberDolares(haber_dolares.toFixed(2))
    setHaberSoles(haber_soles.toFixed(2))
  }
  const change_tipo_cambio=(data)=>{

    const newdata = data.map(item=>item.moneda=='D'?
      {
        ...item,
        haber_soles:(parseFloat(item.haber_dolares)*parseFloat(item.tipo_cambio)).toFixed(2),
        debe_soles:(parseFloat(item.debe_dolares)*parseFloat(item.tipo_cambio)).toFixed(2),
      }:{...item}
    )
   
    return newdata
  }
  const addItemList=(values)=>{

    const dates = MyForm1.getFieldsValue()
    var id =idEdit!=-1?idEdit:data.length
    if(idEdit!=1){
      var newdata = [...data]
      var newValues = {
        'id':'id',
       ...values,
       "fecha_emision":dates.fecha_emision.format("YYYY-MM-DD"),
        "tipo_cambio":tipoCambio
      }
      newdata[idEdit]=newValues
      const newdata1 = change_tipo_cambio(newdata)
      suma_haber_debe(newdata1)
      setData(newdata)

    }else{
      var newValues = {
        'id':id,
        ...values,
        "fecha_emision":dates.fecha_emision.format("YYYY-MM-DD"),
        "tipo_cambio":tipoCambio
      }
      var newdata = [...data,newValues]
      const newdata1 = change_tipo_cambio(newdata)
      suma_haber_debe(newdata1)
      setData(newdata1)
    }
    setIdEdit(-1)
    MyForm2.resetFields()
  }
  const deleteItem=(row)=>{
    const index = data.findIndex(item=>item.id==row.id)
  const newdata = [...data]
  newdata.splice(index,1)
  suma_haber_debe(newdata)
  setData(newdata)
  }
  const editItem=(row)=>{

    const index = data.findIndex(item=>item.id==row.id)
    setIdEdit(index)
    const dataEdit = data[index]
    MyForm2.setFieldsValue({
      ...dataEdit,
      'fecha_vencimiento':dayjs(dataEdit.fecha_vencimiento)
    })
    onCancel()
  }
  const saveData=async(values)=>{

    try{
      if(Math.abs(haberSoles-debeSoles)!=0){
        return message.error("El haber y el debe difieren")
      }
      const url = `${BASE_URL}/api/v1/contabilidad/save/asientos/${document}/`
      
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
      message.error('Ocurrio un error '+err.toString())
    }finally{
      setLoading(false)
    }
  }
  const context1 = {
    tipoAsiento,
    origen,
    ubicacion,
    onCancel,
    MyForm1,
    requestTipoCambio,
    saveData

  }

  const context2 = {
      openModal,
      onCancel,
      tipoDocumento,
      vendedor,
      MyForm2,
      addItemList
  }


  return(
    <div>
      <FormHeaderComponent {...context1} />
      <TableComponent data={data} deleteItem={deleteItem} editItem={editItem}/>
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
      <Loading status={loading}/>
      <ModalFormComponent {...context2}/>

    </div>
  )
}
export default RegistroAsientos