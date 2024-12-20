import { Button, Form, message } from "antd"
import ModalForm from "./ModalForm"
import { useContext, useEffect, useState } from "react"
import TableComponent from "./TableComponent"
import { DELETE_MEDIO_PAGO, EDIT_MEDIO_PAGO, LIST_MEDIO_PAGO, SAVE_MEDIO_PAGO } from "../../../../../service/urls"
import apiMedioPago from "../../../../../api/contabilidad/apiMedioPago"
import Loading from "../../../../components/Loading"
import { Context } from "../../../../components/GlobalContext"
import endpointsGenerics from "../../../../../api/generics/Endpoints"

const ListMedioPago=()=>{
    const [openModal,setOpenModal] = useState(false)
    const [modalMode,setModalMode] = useState(0)
    const [tablaCont,setTablaCont] = useState([])
    const [data,setData] = useState([])
    const [MyForm] = Form.useForm()
    const [loading,setLoading] = useState(false)
    const {document,token} = useContext(Context)
    useEffect(()=>{
        requestMediopago()
        requestManyData()
    },[])
    const onCancel=(option=0)=>{
        setModalMode(option)
        setOpenModal(!openModal)
    }
    const requestManyData=async(query_string='')=>{
        try{
            setLoading(false)
            const datos = {
                'query_string':query_string,
                "dates":['tablas'],
                "tipo_origen":1
            }
            const res =  await endpointsGenerics.ManyData.post(document,token,datos)
            if(res.success && res.tablas){
                setTablaCont(res.tablas)
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
    const editItem=async(row)=>{
        try{
            setLoading(true)
            const url = EDIT_MEDIO_PAGO(document).replace('codigo',row.codigo)
            const res = await apiMedioPago.get(url,token)
            if(res.success){
                MyForm.setFieldsValue(res.data)
                onCancel(1)
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
    const requestMediopago=async()=>{
        try{
            setLoading(true)
            const url = LIST_MEDIO_PAGO(document)
            const res = await apiMedioPago.get(url,token)
            if(res.success){
                setData(res.data)
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
    const saveData=async(values)=>{
        try{
            setLoading(true)
            var url = ''
            if (modalMode==0){
                url = SAVE_MEDIO_PAGO(document)
            }else{

                url = EDIT_MEDIO_PAGO(document).replace('codigo',values.codigo)
            }
            const datos = {...values}
            const res = await apiMedioPago.post(url,token,datos)
            if(res.success){
                message.success(res.message)
                MyForm.resetFields()
                onCancel(0)
                requestMediopago()
            }
            if(res.error){
                message.error(res.error)
            }
        }catch(error){
            message.error(error.toString())
        }finally{
            setLoading(false)
        }
    }
    const deleteItem=async(row)=>{
        try{
            setLoading(true)
            const url = DELETE_MEDIO_PAGO(document).replace('codigo',row.codigo)
            const datos = {
                'codigo':row.codigo
            }
            const res = await apiMedioPago.post(url,token,datos)
            if(res.success){
                message.success(res.message)
                requestMediopago()
            }
            if(res.error){
                message.error(res.error)
            }
        }catch(erro){
            message.error(erro.toString())
        }finally{
            setLoading(false)
        }
    }
    const modalContext = {
        openModal,
        modalMode,
        MyForm,
        onCancel,
        saveData,
        tablaCont,
   
    }
    return(
        <div style={{position:'relative'}}>
            <Button onClick={()=>onCancel(0)} style={{color:'white',background:'blue'}}>
                Agregar
            </Button>
            <TableComponent data={data} deleteItem={deleteItem} editItem={editItem}/>
            <ModalForm  {...modalContext}/>
            <Loading status={loading}/>
        </div>
    )
}
export default ListMedioPago