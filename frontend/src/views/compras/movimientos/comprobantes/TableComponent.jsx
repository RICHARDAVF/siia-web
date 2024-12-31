import { Table } from "antd"
import { FaEdit, FaTrash } from "react-icons/fa"

const TableComponent=({data,editItem,deleteItem})=>{
    const columns = [
            {
                title:"Opcion",
                render:(record)=>(
                    <div style={{justifyContent:'space-between',display:'flex'}}>
                        <FaEdit color="green" size={16} style={{cursor:'pointer'}} onClick={()=>editItem(record)} />
                        <FaTrash color="red" size={16} style={{cursor:'pointer'}} onClick={()=>editItem(record)} />
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
        <Table dataSource={data} columns={columns} scroll={{x:'max-content'}} size="small" rowKey={record=>record.id} />

    )
}
export default TableComponent