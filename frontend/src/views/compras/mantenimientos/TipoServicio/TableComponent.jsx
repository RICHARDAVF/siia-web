import { Popconfirm, Row, Table } from "antd"
import { useState } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"

const TableComponent=(props)=>{
    
    const {data,deleteItem,editItem} = props
   
    const columns = [
        {
            title:'Opcion',
            dataIndex:'opcion',
            key:'opcion',
            render:(_,record)=>(
                <Row style={{justifyContent:'space-around'}}>
                    <Popconfirm
                    title='Eliminar registro'
                    description='¿Esta seguro de eliminar?'
                    okText='Si'
                    cancelText='No'
                    onConfirm={()=>deleteItem(record)}
                    >
                        <FaTrash style={{color:'red',cursor:'pointer'}}/>
                    </Popconfirm>
                    
                    <FaEdit onClick={()=>editItem(record,1)} style={{color:'green',cursor:'pointer'}}/>
                  
                </Row>
            )
        },
        {
            title:'Codigo',
            dataIndex:'codigo',
            key:'codigo'
        },
        {
            title:'Nombre',
            dataIndex:'nombre',
            key:'nombre'
        },
        {
            title:'Procenaje',
            dataIndex:'porcentaje',
            key:'porcentaje',
            render:(_,record)=>(
                <div >
                    <strong style={{background:'#0bf627',color:'white',paddingLeft:2,paddingRight:2,borderRadius:5}}>
                        {record.porcentaje}%
                    </strong>
                </div>
            )
        }
    ]
    return(
    <Table
    size="small"
    dataSource={data}
    columns={columns}
    scroll={{x:'max-content'}}
    rowKey={record=>`${record.id}`}
    />
)
}
export default TableComponent