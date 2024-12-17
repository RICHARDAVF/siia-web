import { Popconfirm, Row, Table } from "antd"
import { FaEdit, FaTrash } from "react-icons/fa"
import React,{forwardRef,useRef} from "react";
const CustomPopconfirm = forwardRef((props, ref) => ( <Popconfirm ref={ref} {...props}> {props.children} </Popconfirm> ));
const TableComponent=({data,deleteItem,editItem})=>{
    const popconfirmRef=useRef(null)
    const columns = [
        {
            title:'Opcion',
            dataIndex:'opcion',
            key:'opcion',
            render:(_,record)=>(
                <Row style={{justifyContent:'space-around'}}>
                    <CustomPopconfirm
                    ref={popconfirmRef} 
                    title="¿Estás seguro de eliminar?" 
                    onConfirm={()=>deleteItem(record)}
                    okText="Sí" 
                    cancelText="No"
                    >
                        <FaTrash style={{color:'red',cursor:'pointer'}} />
                    </CustomPopconfirm>
                    <FaEdit style={{color:'green',cursor:'pointer'}} onClick={()=>editItem(record)} />
                </Row>
            )
        },
        {
            title:'Codigo',
            dataIndex:'codigo',
            key:'codigo',
        },
        {
            title:'Nombre',
            dataIndex:'nombre',
            key:'nombre'
        },
        {
            title:'Origen',
            dataIndex:'origen',
            key:'origen'
        },
        {
            title:'Tipo Origen',
            dataIndex:'tipo_origen',
            key:'tipo_origen'
        }
    ]
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>record.id} size="small" scroll={{x:'max-content'}}/>
    )
}
export default TableComponent