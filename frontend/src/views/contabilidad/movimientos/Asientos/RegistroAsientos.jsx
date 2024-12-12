import {useContext, useEffect, useState } from "react";
import FormHeaderComponent from "./FormHeaderComponent";
import endpointsGenerics from "../../../../../api/generics/Endpoints";
import { Context } from "../../../../components/GlobalContext";
import { message,Row,Col,Input } from "antd";
import ModalFormComponent from "./ModalFormComponent";
import TableComponent from "./TableComponent";
const RegistroAsientos=()=>{
  const [tipoAsiento,setTipoAsiento] = useState([])
  const [origen,setOrigen] = useState([])
  const [ubicacion,setUbicacion] = useState([])
  const [tipoDocumento,setTipoDocumento] = useState([])
  const [openModal,setOpenModal] = useState(false) 
  const {document,token} = useContext(Context)
  const [haberSoles,setHabelSoles] = useState(0)
  const [haberDolares,setHaberDolares] = useState(0)
  const [debeSoles,setDebeSoles] = useState(0)
  const [debeDolares,setDebeDolares] = useState(0)
  useEffect(()=>{
    requestManyData()
  },[])
  const onCancel=()=>{
    setOpenModal(!openModal)
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
  }

  const context1 = {
    tipoAsiento,
    origen,
    ubicacion,
    onCancel
  }
  const context2 = {
      openModal,
      onCancel,
      tipoDocumento

  }
  
  return(
    <div>
      <FormHeaderComponent {...context1} />
      <TableComponent/>
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
      <ModalFormComponent {...context2}/>

    </div>
  )
}
export default RegistroAsientos