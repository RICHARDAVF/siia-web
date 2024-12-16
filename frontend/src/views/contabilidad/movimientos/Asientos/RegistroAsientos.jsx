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
  },[])
  const onCancel=()=>{
    setOpenModal(!openModal)
  }
  useEffect(()=>{
    if(params.action=='edit' ){
      requestAsientos(params)
    }
  },[])
  const requestAsientos=async(params)=>{
    try{
      setLoading(true)
  
      const {comprobante,mes,origen} = params.data
      const query_string = `${comprobante}-${mes}-${origen}`
      const url = EDIT_ASIENTOS(document).replace('codigo',query_string)
      const res = await Asientos.get(url,token)
      if(res.success){
        console.log(res)
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
        const newdata = process_data(data)
        setData(newdata)
      }
    }catch(erro){
      message.error(erro.toString())
    }finally{
      setLoading(false)
    }
  }

  const process_data=(data)=>{
    var haber_dolares = 0
    var debe_dolares = 0
    var haber_soles = 0
    var debe_soles = 0
    const newdata = data.map(item=>item.moneda=='D'?
      {
        ...item,
        haber_soles:(parseFloat(item.haber_dolares)*parseFloat(tipoCambio)).toFixed(2),
        debe_soles:(parseFloat(item.debe_dolares)*parseFloat(tipoCambio)).toFixed(2),tipo_cambio:tipoCambio
      }:{...item,tipo_cambio:tipoCambio}
    )
    for (var item of newdata){
      haber_soles+=parseFloat(item.haber_soles)
      haber_dolares+=parseFloat(item.haber_dolares)
      debe_soles+=parseFloat(item.debe_soles)
      debe_dolares+=parseFloat(item.debe_dolares)
    }
    setDebeDolares(debe_dolares.toFixed(2))
    setDebeSoles(debe_soles.toFixed(2))
    setHaberDolares(haber_dolares.toFixed(2))
    setHaberSoles(haber_soles.toFixed(2))
    return newdata
  }
  const addItemList=(values)=>{
    const dates = MyForm1.getFieldsValue()
    const newValues = {
      ...values,
      "fecha_emision":dates.fecha_emision.format("YYYY-MM-DD"),
      "tipo_cambio":tipoCambio
    }
    const data_process = process_data([...data,newValues])
    setData(data_process)
    MyForm2.resetFields()
  }
  const deleteItem=(index,row)=>{
  const newdata = [...data]
  newdata.splice(index,1)
  const data_new = process_data(newdata)
  setData(data_new)
  }
  const editItem=(index,row)=>{
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
      console.log('pass')
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