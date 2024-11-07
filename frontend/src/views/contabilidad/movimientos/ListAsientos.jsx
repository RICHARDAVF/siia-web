import { Table,message } from "antd"
import { useContext, useEffect,useState } from "react"
import config from "../../../config"
import { Context } from "../../../components/GlobalContext"
import { FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const ListAsientos=()=>{
    const [data,setData]=useState([])
    const {BASE_URL} = config
    const {token,document} = useContext(Context)
    const navigate = useNavigate()
    useEffect(()=>{
        requestAsientos()
    },[])
    const onEditAsiento=(item)=>{
        navigate("/asientos/create",{state:{'params':item}})
    }
    const requestAsientos=async()=>{
        try{

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
            message.error(res.message)
        }finally{

        }
      

    }
    const columns = [
        {
            title:"Fecha",
            dataIndex:"fecha",
            key:'fecha',
            render:(text)=><p>{text}</p>
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
        },
        {
            title:"Acciones",
            key: 'acciones',
            render: (row) => (
                <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <FaEdit style={{ color: 'green',cursor:'pointer' }} onClick={()=>onEditAsiento(row)} />
                </div>
            )
        }
    ]
    return (
        <Table 
        dataSource={data} 
        columns={columns}
        rowKey={(record)=>`${record.mes}-${record.comprobante}`}
        />

        
    )
}
export default ListAsientos