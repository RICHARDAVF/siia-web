import { message, Table } from "antd"
import { useContext, useEffect,useState } from "react"
import config from "../../../../config"
import { Context } from "../../../../components/GlobalContext"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Loading from "../../../../components/Loading"
import EndPointContabilidad from "../../../../../api/contabilidad/apiAsientos"
import { DELETE_ASIENTOS } from "../../../../../service/urls"

const ListAsientos=()=>{
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(false)
    const {BASE_URL} = config
    const {token,document} = useContext(Context)
    const navigate = useNavigate()
    useEffect(()=>{
        requestAsientos()
        window.document.title = 'Listado de Asientos'
    },[])
    const onEditAsiento=(item)=>{
        navigate("/registro/asientos",{state:{'params':{'data':item,'action':'edit'}}})
    }
    const requestAsientos=async()=>{
        try{
            setLoading(true)
            const url = `${BASE_URL}/api/v1/contabilidad/list/${document}/`
            const response=await fetch(url,{
                method:'POST',
                headers:{
                    "Content-Type":'applicaion/json',
                    "Authorization":`Bearer ${token}` 
                }
            })
            const res = await response.json()
    
            setData(res.data)
        }catch(error){
            message.error(error.toString())
        }finally{
            setLoading(false)
        }

    }
    const onDelete=async(item)=>{
        try{
            setLoading(true)
            const {comprobante,origen,mes} = item
            const datos = {
                'comprobante':comprobante,
                'origen':origen,
                'mes':mes
            }
            const url = DELETE_ASIENTOS(document)
            const res = await EndPointContabilidad.Asientos.post(url,datos,token)
            if(res.success){
                message.success(res.message)
                requestAsientos()
            }else{
                message.error(res.error)
            }
        }catch(error){
            message.error(error.toString())
        }finally{
            setLoading(false)
        }
    }
    const columns = [
        {
            title:"Acciones",
            key: 'acciones',
            render: (row) => (
                <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                    <FaEdit style={{ color: 'green',cursor:'pointer' }} onClick={()=>onEditAsiento(row)} />
                    <FaTrash style={{ color: 'red',cursor:'pointer' }} onClick={()=>onDelete(row)} />
                </div>
            )
        },
        {
            title:"Fecha",
            dataIndex:"fecha",
            key:'fecha',
            render:(text)=><p>{text}</p>,
            sortDirections: ['descend', 'ascend']
        },
        {
            title:'Mes',
            dataIndex:'mes',
            key:'mes'
        },
        {
            title:'Origen',
            dataIndex:'origen',
            key:'origen',
        },
        {
            title:'Comprobante',
            dataIndex:'comprobante',
            key:'comprobante',
        },
        {
            title:'Obersevacion',
            dataIndex:'observacion',
            key:'observacion'
        }
        
    ]
    return (
        <div style={{position:'relative'}}>
            <div>
                <input type="button" value={"AGREGAR"} style={{background:'blue',color:'white',borderRadius:5,padding:3,cursor:'pointer'}} onClick={()=>navigate('/registro/asientos',{state:{params:{"action":"add"}}})}/>
            </div>
            <Table 
            dataSource={data} 
            columns={columns}
            rowKey={(record)=>`${record.id}`}
            size="small"
            />
            <Loading status={loading}/>
        </div>

        
    )
}
export default ListAsientos