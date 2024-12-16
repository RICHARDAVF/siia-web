import { Table } from "antd"
import { useContext, useEffect,useState } from "react"
import config from "../../../../config"
import { Context } from "../../../../components/GlobalContext"
import { FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Loading from "../../../../components/Loading"

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

    }
    const columns = [
        {
            title:"Acciones",
            key: 'acciones',
            render: (row) => (
                <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <FaEdit style={{ color: 'green',cursor:'pointer' }} onClick={()=>onEditAsiento(row)} />
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
                <input type="button" value={"AGREGAR"} style={{background:'blue',color:'white',borderRadius:5,padding:3,cursor:'pointer'}} onClick={()=>navigate('/registro/asientos',{status:{params:{"action":"add"}}})}/>
            </div>
            <Table 
            dataSource={data} 
            columns={columns}
            rowKey={(record)=>`${record.mes}-${record.comprobante}`}
            size="small"
            />
            <Loading status={loading}/>
        </div>

        
    )
}
export default ListAsientos