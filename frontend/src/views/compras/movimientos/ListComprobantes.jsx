import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../../../components/GlobalContext"
import config from "../../../config"
import Loading from "../../../components/Loadgin"
import { Input, Table,message } from "antd"
import { FaCheck, FaEdit } from "react-icons/fa"
const ListComprobates=()=>{
    const navigate = useNavigate()
    const {token,document} = useContext(Context)
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [searchText,setSearchText] = useState("")
    const [searchColumn,setSearchColumn] = useState("")
    const searchInput = useRef(null)
    const {BASE_URL} = config
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
    const updateItem=({mes,origen,comprobante})=>{
        navigate("/registro/comprobantes",{state:{"params":{mes,origen,comprobante,"action":"edit"}}})
    }
    const handleSearch=(selectedKey,confirm,dataIndex)=>{
        confirm(),
        setSearchText(selectedKey[0])
        setSearchColumn(dataIndex)
    }
    const handleReset=(clearFilters)=>{
        clearFilters()
        setSearchText()
    }
    const getColumnSearch=(dataIndex)=>(
        {filterDropdown:({setSelectedKeys,selectedkeys,confirm,clearFilters,close})=>(
            <div style={{padding:8}} onKeyDown={(e)=>e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedkeys[0]}
                    onChange={(e)=>setSelectedKeys(e.target.value?[e.target.value]:[])}
                    onPressEnter={()=>handleSearch(selectedkeys,confirm,dataIndex)}
                    style={{marginBottom:8,display:"block"}}
                />
            </div>
        )}
    )
    const columns = [
        {
            title:"Opcion",
            render:(record)=>(
                <div style={{justifyContent:'center',display:'flex'}}>
                    <FaEdit color="green" size={18} style={{cursor:'pointer'}} onClick={()=>updateItem(record)} />
                </div>
            )
        },
        {
         
            title:"Fecha",
            dataIndex:"fecha",
            width:105,
        },
        {
         
            title:"Mes",
            dataIndex:"mes",
        },
        {
         
            title:"Origen",
            dataIndex:"origen",
        },
        {
         
            title:"Compro",
            dataIndex:"comprobante",
        },
        {
         
            title:"Serie",
            dataIndex:"serie",
        },
        {
         
            title:"Numero",
            dataIndex:"numero",
        },
        {
         
            title:"Razon Social",
            dataIndex:"razon_social",
        },
        {
         
            title:"RUC",
            dataIndex:"ruc",
        },
        {
         
            title:"Total S/",
            dataIndex:"total",
            render:(tex)=>(<div style={{background:'#a3f2ae',paddingLeft:5,paddingRight:5,borderRadius:10,textAlign:'right'}}>
                {tex}
            </div>)
        },
        {
         
            title:"Observ.",
            dataIndex:"obs",
        },
        
    ]
    return(
        <div  style={{ position: "relative" }}
        >
            <Table
             dataSource={data}
             columns={columns}
             scroll={{x:"max-content"}}
            rowKey={(record)=>`${record.mes}-${record.comprobante}`}

             />
             
            <Loading status={loading} />
             
        </div>
    )
}
export default ListComprobates