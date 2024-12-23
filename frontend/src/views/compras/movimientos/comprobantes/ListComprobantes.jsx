import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../../../../components/GlobalContext"
import config from "../../../../config"
import Loading from "../../../../components/Loading"
import { message } from "antd"
import TableComponent from "./TableComponent"
const ListComprobantes=()=>{
    const navigate = useNavigate()
    const {token,document} = useContext(Context)
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])

    const {BASE_URL} = config
    useEffect(()=>{
        window.document.title = 'Listado de Comprobantes'
    },[])
    useEffect(()=>{
        requestComprobantes()
    },[])
    const requestComprobantes=async()=>{
        setLoading(true)
        const url = `${BASE_URL}/api/v1/compras/list/comprobantes/${document}/`
        try{
            const datos = {
                "tipo_origen":1
            }
            const response = await fetch(url,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify(datos)
            })
            const res = await response.json()
            if(res.error){
                message.error(res.error)
                return -1
            }
            setData(res)
        }catch(error){
            message.error(error)
        }finally{
            setLoading(false)
        }
    }

    const editItem=(row)=>{
        navigate("/registro/comprobantes",{state:{params:{'data':row,'action':"edit"}}})
    }



    return(
        <div  style={{ position: "relative" }}
        >
        <div>
            <input type="button" value={"AGREGAR"} style={{background:'blue',color:'white',padding:3,borderRadius:5,cursor:'pointer'}} onClick={()=>navigate("/registro/comprobantes",{state:{"params":{"action":"add"}}})} />
        </div>

            <TableComponent data={data} editItem={editItem} deleteItem={()=>{}} />
        <Loading status={loading} />
             
        </div>
    )
}
export default ListComprobantes