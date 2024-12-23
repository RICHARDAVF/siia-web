import { useContext, useEffect, useState } from "react"
import TableComponent from "./TableComponent"
import { Context } from "../../../../components/GlobalContext"
import config from "../../../../config"
import { message } from "antd"

const RecepcionDocumentoList=()=>{
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const {token,document} = useContext(Context)
    const {BASE_URL} = config
    useEffect(()=>{
        requestRecepcionDocumentos()
    },[])
    const requestRecepcionDocumentos=async()=>{
        setLoading(true)
        const url = `${BASE_URL}/api/v1/compras/list/recepcion-documentos/${document}/`
        try{
            const response = await fetch(url,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            })
            const res = await response.json()
            if(res.success){
                setData(res.data)
            }
            if(res.error){
                message.error(res.error)
                
            }
        }catch(error){
            message.error(error)
        }finally{
            setLoading(false)
        }
    }
    const editItem=(values)=>{

    }
    const deleteItem=(value)=>{

    }
    return (
        <TableComponent data={data} editItem={editItem} deleteItem={deleteItem} />
    )
}
export default RecepcionDocumentoList