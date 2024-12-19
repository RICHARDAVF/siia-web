import { useContext, useEffect, useState } from "react"
import Loading from "../../../../components/Loading"
import { Context } from "../../../../components/GlobalContext"
import { DELETE_CONDICION_PAGO, EDIT_CONDICION_PAGO, LIST_CONDICION_PAGO, SAVE_CONDICION_PAGO } from "../../../../../service/urls"
import { endpointsCondicionPago } from "../../../../../api/compras/apiCompras"
import { Button, Form, message } from "antd"
import { TableComponent } from "./TableComponent"
import { ModalForm } from "./ModalForm"
import endpointsGenerics from "../../../../../api/generics/Endpoints"

const ListCondicionPago=()=>{
    const [loading,setLoading] = useState(false)
    const {document,token,user} = useContext(Context)
    const [TablaCont,setTablaCont] = useState([])
    const {CondicionPago} = endpointsCondicionPago
    const {ManyData} = endpointsGenerics
    const [data,setData] = useState([])
    const [openModal,setOpenModal]=useState(false)
    const [titleMode,setTitleMode] = useState(0)
    const [MyForm] = Form.useForm()
    const [dataForm,setDataForm] = useState({})

    const titleModal = titleMode==0?'Agregar Condicion de Pago':
    titleMode==1?'Editar Condicion de Pago':'Visualizar Condicion de pago'
    useEffect(()=>{
        requestCondicionesPago()
        requestTablas('')
    },[])

    const onCancel=(titleMode)=>{
        setTitleMode(titleMode)
        setOpenModal(!openModal)
    }
    const requestTablas=async(query_string)=>{
        try{
            const datos = {
                'query_string':query_string,
                'dates':['tablas'],
                'tipo_origen':1
            }

            const res = await ManyData.post(document,token,datos)
            if(res.success && res.tablas){
               
                setTablaCont(res.tablas)
            }
            if(res.error){
                message.error(res.error)
            }
        }catch(err){
            message.error(err.toString())
        }
    }
    const requestCondicionesPago=async()=>{
        try{
            setLoading(true)
            const url = LIST_CONDICION_PAGO(document)
            const res = await CondicionPago.get(url,token)
            if(res.error){
                message.error(res.error)
            }
            if(res.success){
                setData(res.data)
            }
        }catch(err){
            message.error(err.toString())
        }finally{
            setLoading(false)
        }
    }
    const editItem=async(item,option=1)=>{
        try{
            setLoading(true)
            const url = EDIT_CONDICION_PAGO(document).replace("codigo",item.codigo)
            const res = await CondicionPago.get(url,token)
            if(res.error){
                message.error(res.error)
            }
            if(res.success){
                const values = {...item,...res.data}
                setDataForm(values)
                MyForm.setFieldsValue(values)
                onCancel(option)
            }
        }catch(erro){
            message.error(erro.toString())
        }finally{
            setLoading(false)
  
        }
    }
    const onFinish=async(values)=>{
        
        try{
            setLoading(true)
            var url = ''
            if(titleMode==0){
                url = SAVE_CONDICION_PAGO(document)
            }
            if(titleMode==1){
                url = EDIT_CONDICION_PAGO(document).replace('codigo',values.codigo)
            }
            const res = await CondicionPago.post(url,token,values)
            if(res.success){
                message.success(res.message)
                MyForm.resetFields()
                onCancel(0)
                requestCondicionesPago()
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
            const url = DELETE_CONDICION_PAGO(document)
            const datos = {'codigo':item.codigo}
            const res = await CondicionPago.delete(url,token,datos)
            if(res.success){
                message.success(res.message)
                requestCondicionesPago()
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
    const contexModal={
        openModal,
        onCancel,
        titleModal,
        titleMode,
        MyForm,
        dataForm,
        onFinish,
        TablaCont,
        requestTablas
    }

    return(
        <div style={{position:'relative'}}>
            <Button style={{background:'blue',color:'white'}} onClick={()=>onCancel(0)}>
                Agregar
            </Button>
            <TableComponent data={data} onCancel={onCancel} editItem={editItem} deleteItem={deleteItem} />
            <ModalForm {...contexModal} />
            <Loading status={loading}/>
        </div>
    )
}

export default ListCondicionPago