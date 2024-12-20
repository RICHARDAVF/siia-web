import { Row, Table,Popconfirm } from "antd"
import { forwardRef,useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
const CustomPopconfirm = forwardRef((props, ref) => ( <Popconfirm ref={ref} {...props}> {props.children} </Popconfirm> ));

const TableComponent=({data,editItem,deleteItem})=>{
    const columns = [
        {
            title:'Opcion',
            dataIndex:'option',
            key:'option',
            render:(_,row)=>(
                <Row style={{justifyContent:'space-around'}}>
                    
                    <FaEdit style={{color:'green',cursor:'pointer'}} onClick={()=>editItem(row)}/>
        
                    <CustomPopconfirm
                    title='¿Esta seguro de eliminar el registro?'
                    onConfirm={()=>deleteItem(row)}
                    okText={'Si'}
                    cancelText={'No'}
                    >
                        <FaTrash style={{color:'red',cursor:'pointer'}}/>
                    </CustomPopconfirm>
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
            key:'nombre',
        },
        {
            title:'Cuenta',
            dataIndex:'cuenta',
            key:'cuenta',
        },
        {
            title:'Grupo',
            dataIndex:'grupo',
            key:'grupo'
        }
    ]
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>record.id} size="small"/>
    )
}
export default TableComponent