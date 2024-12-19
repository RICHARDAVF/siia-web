import { useContext, useEffect, useState } from "react"
import TableComponent from "./TableComponent"
import { Button, Form, message } from "antd"
import { DELETE_ORIGENES, EDIT_ORIGENES, LIST_CUENTAS, LIST_ORIGENES, SAVE_ORIGENES } from "../../../../../service/urls"
import { Context } from "../../../../components/GlobalContext"
import Loading from "../../../../components/Loading"
import endpointOrigen from "../../../../../api/contabilidad/apiOrigen"
import ModalForm from "./ModalForm"
import endpointsGenerics from "../../../../../api/generics/Endpoints"

const ListOrigenes=()=>{
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openModal,setOpenModal] = useState(false)
    const [cuentas,setCuentas] = useState([])
    const [modalMode,setModalMode] = useState(0)
    const {document,token,user} = useContext(Context)
    const [MyForm] = Form.useForm()
    const titleModal = modalMode==0?'Registrar un origen':'Editar un origen'
    const {Cuentas} = endpointsGenerics
    useEffect(()=>{
        requestOrigenes()
        requestCuentas()
    },[])
    const requestCuentas = async () => {
        try{
            setLoading(true)
            const url = LIST_CUENTAS(document)
            const datos = {
                'action':'cuenta10',
                'query_string':''
            }
            const res = await Cuentas.post(url,token,datos)
            setCuentas(res)

        }catch(err){
            message.error(err.toString())
        }finally{
            setLoading(false)
        }
    }
    const requestOrigenes=async()=>{
        try{
            setLoading(true)
            const url = LIST_ORIGENES(document)
            const res = await endpointOrigen.get(url,token)
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
    const onCancel=(option=0)=>{
        
        setOpenModal(!openModal)
        setModalMode(option)
        
    } 
    const saveData=async(values)=>{
        try{
            const datos = {
                ...values,
                'codigo_usuario':user.codigo_usuario
     
            }
            var url = ''
            if(modalMode==0){
                url = SAVE_ORIGENES(document)
            }
            if(modalMode==1){
                url = EDIT_ORIGENES(document).replace('codigo',values.codigo)
            }
    
            const res = await endpointOrigen.post(url,token,datos)
            if(res.success){
                onCancel(0)
                message.success(res.message)
                requestOrigenes()
                MyForm.resetFields()
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
    const deleteItem=async(item)=>{
        try{
            setLoading(true)
            const url = DELETE_ORIGENES(document)
            const datos = {
                'codigo':item.codigo
            }
            const res = await endpointOrigen.post(url,token,datos)

            if(res.success){
                message.success(res.message)
                requestOrigenes()
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
    const editItem=async(item)=>{
        try{
            setLoading(true)
            const url = EDIT_ORIGENES(document).replace('codigo',item.codigo)
            const res = await endpointOrigen.get(url,token)
   
            if(res.success){
                MyForm.setFieldsValue({...res.data})
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
    const modalContext = {
        MyForm,
        openModal,
        titleModal,
        onCancel,
        saveData,
        modalMode,
        cuentas,
        

    }
   
    return(
        <div style={{position:'relative'}}>
            <Button style={{background:'blue',color:'white'}}
            onClick={()=>onCancel(0)}>
                Agregar
            </Button>
            <TableComponent data={data} deleteItem={deleteItem} editItem={editItem}/>
            <ModalForm {...modalContext} />
            <Loading status={loading}/>
        </div>
    )
}
export default ListOrigenes