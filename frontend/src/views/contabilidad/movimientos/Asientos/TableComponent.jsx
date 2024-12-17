import { Table,Row,Popconfirm } from "antd"
import { FaTrash,FaEdit } from "react-icons/fa"
import { forwardRef,useRef } from "react";
const CustomPopconfirm = forwardRef((props, ref) => ( <Popconfirm ref={ref} {...props}> {props.children} </Popconfirm> ));

const TableComponent = (props)=>{
    const popconfirmRef=useRef(null)
  
    const {data,deleteItem,editItem} = props
    const columns = [
        {
          title:"Opcion",
          dataIndex:"opcion",
          key:"opcion",
          render:(_,row)=>(
            <Row style={{justifyContent:'space-between'}}>
              <CustomPopconfirm
              ref={popconfirmRef}
              title="Eliminar item"
              description= "¿Esta seguro de eliminar?"
              okText="Si"
              onConfirm={()=>deleteItem(row)}
              cancelText="No"
              
              >         
                  <FaTrash style={{color:"red",cursor:"pointer"}}/>
    
              </CustomPopconfirm>
              <CustomPopconfirm
              ref={popconfirmRef}
              
              title="Editar item"
              description= "¿Esta seguro de editar?"
              okText="Si"
              onConfirm={()=>editItem(row)}
              cancelText="No"
             
              >
                <FaEdit style={{color:'green',cursor:'pointer'}}/>
              </CustomPopconfirm>
            </Row>
          )
        },
        {
          title: 'Cuenta',
          dataIndex: 'cuenta',
          key:"cuenta"
        },
        {
          title: 'Cliente',
          dataIndex: 'auxiliar',
          key:"auxiliar"
        },
        {
          title: "Vendedor",
          dataIndex: "vendedor",
          key:"vendedor"
        },
        {
          title: "F. Emision",
          dataIndex: "fecha_emision",
          key: "fecha_emision",
        },
        {
          title: 'T.D',
          dataIndex: 'tipo_documento',
          key: 'tipo_documento',
        },
        {
          title: 'Serie',
          dataIndex: 'serie',
          key:"serie"
        },
        {
          title: 'Numero',
          dataIndex: 'numero',
          key:"numero"
        },
        {
          title: "Moneda",
          dataIndex: "moneda",
        },
        {
          title: "Haber S/",
          dataIndex: "haber_soles",
        },
        {
          title: 'Debe S/',
          dataIndex: 'debe_soles',
        },
        {
          title: 'Haber $',
          dataIndex: 'haber_dolares',
        },
        {
          title: 'Debe $',
          dataIndex: 'debe_dolares',
        },
        {
          title: 'Tipo/Cambio',
          dataIndex: 'tipo_cambio',
        },
        {
          title: 'Glosa',
          dataIndex: 'glosa',
        },
        {
          title: 'F. Venc.',
          dataIndex: 'fecha_vencimiento',
        }
      ]
    return (
        <Table dataSource={data} columns={columns} scroll={{ x: 'max-content' }} size="small" rowKey={record=>record.id}/>
    )
}
export default TableComponent