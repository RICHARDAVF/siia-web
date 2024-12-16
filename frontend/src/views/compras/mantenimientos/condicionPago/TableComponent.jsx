import { Popconfirm, Row, Table } from "antd"
import {FaEdit, FaRegEye, FaTrash } from "react-icons/fa"

export const TableComponent=(props)=>{
    const {data,editItem,deleteItem} = props
    const columns = [
        {
            title:'Opcion',
            dataIndex:'opcion',
            key:'opcion',
            render:(_,record)=>(
                <Row style={{justifyContent:'space-evenly',display:'flex',flexDirection:'row'}}>
                    <FaRegEye onClick={()=>editItem(record,3)} style={{cursor:'pointer',color:'blue'}} size={15}/>
                    <FaEdit onClick={()=>editItem(record)} style={{cursor:'pointer',color:'green'}} size={15}/>
                    <Popconfirm
                        title='Eliminar condicion de pago'
                        description={'¿Esta seguro de eliminar el registro?'}
                        okText={'Sí'}
                        cancelText={'No'}
                        onConfirm={()=>deleteItem(record)}
                    >

                    <FaTrash style={{cursor:'pointer',color:'red'}} size={15}/>
                    </Popconfirm>
                </Row>
            )
        },
        {
            title:'Codigo',
            dataIndex:'codigo',
            key:'codigo'
        },
        {
            title:"Nombre",
            dataIndex:'nombre',
            key:'nombre'
        },
        {
            title:"N° Letras",
            dataIndex:'cantidad_letras',
            key:'cantidad_letras'
        },
        {
            title:'Dias',
            dataIndex:'dias',
            key:'dias',
            render:(_,row)=>{
                return (
                    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between'}}>
                   {     row.dias.map((value,index)=>(
                            <strong style={{ borderWidth: 1,paddingRight:4,paddingLeft:4, borderRadius: 5, borderColor: 'black', background: '#ffeaed', borderStyle: 'solid', fontSize: 10, height: '20px', 
                             lineHeight: '20px', 
                             display: 'inline-block', textAlign: 'center', 
                             verticalAlign: 'middle' }} key={index}>{value}</strong>
                        ))}
                    </div>
                )
                
            }
        },
        {
            title:'Estado',
            dataIndex:'estado',
            key:'estado',
            render:(_,row)=>{
                if(row.status==1){
                    return <strong style={{fontSize:10,background:'#98fd45',textAlign:'center',paddingRight:5,paddingLeft:5,borderRadius:5}}>{row.estado}</strong>
                }
                if(row.status==0){
                    return <strong style={{fontSize:10,background:'#ff889a',textAlign:'center',paddingRight:5,paddingLeft:5,borderRadius:5}}>{row.estado}</strong>
                }
            }
        },
        {
            title:'Tipo',
            dataIndex:'tipo',
            key:'tipo'
        }
    ]
    
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>`${record.id}`} size="small"/>
    )
}