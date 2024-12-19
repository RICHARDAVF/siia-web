import { Button, Form, message } from "antd"
import ModalForm from "./ModalForm"
import { useContext, useEffect, useState } from "react"
import TableComponent from "./TableComponent"
import { LIST_MEDIO_PAGO } from "../../../../service/urls"
import apiMedioPago from "../../../../api/contabilidad/apiMedioPago"
import Loading from "../../../components/Loading"
import { Context } from "../../../components/GlobalContext"

const ListMedioPago=()=>{
    const [openModal,setOpenModal] = useState(false)
    const [modalMode,setModalMode] = useState(0)
    const [data,setData] = useState([])
    const [MyForm] = Form.useForm()
    const [loading,setLoading] = useState(false)
    const {document,token} = useContext(Context)
    useEffect(()=>{
        requestMediopago()
    })
    const onCancel=()=>{
        setOpenModal(!openModal)
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
    const modalContext = {
        openModal,
        modalMode,
        MyForm,
        onCancel
    }
    return(
        <div style={{position:'relative'}}>
            <Button onClick={onCancel} style={{color:'white',background:'blue'}}>
                Agregar
            </Button>
            <TableComponent data={data}/>
            <ModalForm  {...modalContext}/>
            <Loading status={loading}/>
        </div>
    )
}
export default ListMedioPago