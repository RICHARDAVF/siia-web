import { Button, Form, message } from "antd"

import { DELETE_TIPO_SERVICIO, EDIT_TIPO_SERVICIO, LIST_TIPO_SERVICIO, SAVE_TIPO_SERVICIO } from "../../../../../service/urls"
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../components/GlobalContext"
import { endpointsTipoServicio } from "../../../../../api/compras/apiCompras"
import TableComponent from "./TableComponent"
import ModalForm from "./ModalForm"
const ListTipoServicio=()=>{
    const {document,token} = useContext(Context)
    const {TipoServicio} = endpointsTipoServicio
    const [loading,setLoading] = useState(false)
    const [modalMode,setModalMode] = useState(0)
    const [openModal,setOpenModal] = useState(false)
    const [data,setData] = useState([])
    const [MyForm] = Form.useForm()
   
    useEffect(()=>{
        requestTipoServicio()
    },[])
    const requestTipoServicio=async()=>{
        try{
            setLoading(true)
            const url = LIST_TIPO_SERVICIO(document)
           
            const res = await TipoServicio.get(url,token)

            if(res.success){
                setData(res.data)
            }
            if(res.error){
                message.error(res.error)
            }
        }catch(err){
            message.error(err)
        }finally{
            setLoading(false)
        }
    }
    const deleteItem=async(record)=>{
        try{
            setLoading(true)
            const url = DELETE_TIPO_SERVICIO(document)
            const datos = {
                'codigo':record.codigo
            }
            const res = await TipoServicio.post(url,token,datos)
            if(res.success){
                message.success(res.message)
                requestTipoServicio()
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
    const onCancel=(option=0)=>{
        setModalMode(option)
        setOpenModal(!openModal)
    }
    const saveData=async(values)=>{
        try{
            var url = ''
            if(modalMode==0){
                url = SAVE_TIPO_SERVICIO(document)
            }else{
                url = EDIT_TIPO_SERVICIO(document).replace('codigo',values.codigo)
            }
            const datos = {
                ...values
            }
            const res = await TipoServicio.post(url,token,datos)
            if(res.success){
                message.success(res.message)
                setOpenModal(0)
                MyForm.resetFields()
                requestTipoServicio()
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
    const editItem=async(item,option)=>{
        try{
            setLoading(true)
            const url = EDIT_TIPO_SERVICIO(document).replace('codigo',item.codigo)
            const res = await TipoServicio.get(url,token)
            if(res.success){
                MyForm.setFieldsValue(res.data)
                onCancel(option)
            }
            else{
                message.error(res.error)
            }
        }catch(err){
            message.error(err.toString())
        }finally{
            setLoading(false)
        }

    }

    const modalContex = {
        onCancel,
        openModal,
        saveData,
        MyForm,
        modalMode
        

    }
    return(
        <div style={{position:'relative'}}>
            <Button onClick={()=>onCancel(0)} style={{background:'blue',color:'white'}}>
                Agregar
            </Button>
           <TableComponent data={data} deleteItem={deleteItem} editItem={editItem} />
            <ModalForm {...modalContex}/>
        </div>
    )
}
export default ListTipoServicio