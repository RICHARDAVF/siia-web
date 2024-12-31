import { Table,Popconfirm } from "antd"
import { FaTrash } from "react-icons/fa"
import { forwardRef } from "react";
const CustomPopconfirm = forwardRef((props, ref) => ( <Popconfirm ref={ref} {...props}> {props.children} </Popconfirm> ));

const TableItemList=({data,deleteItem})=>{

    const columns = [
        {
          "title": "Opcion",
          key: 'opcion',
          render: (_, row,) => (
            <CustomPopconfirm
              title='Eliminar asiento'
              description='¿Esta seguro de eliminar el asiento?'
              okText='Si'
              onConfirm={() => deleteItem(row.id)}
              cancelText='No'

            >
              <FaTrash  style={{color:'red',cursor:'pointer'}} />
            </CustomPopconfirm>
          )
        },
        {
          title: 'Cuenta',
          dataIndex: 'cuenta',
          key: 'cuenta',
        },
        {
          title: 'CC',
          dataIndex: 'centro_costo',
          key: 'centro_costo'
        },
        {
          title: "Moneda",
          dataIndex: "moneda",
          key: "moneda",
        },
        {
          title: "Haber S/",
          dataIndex: "haber_soles",
          key: 'haber_soles'
        },
        {
          title: 'Debe S/',
          dataIndex: 'debe_soles',
          key: 'debe_soles'
        },
        {
          title: 'T/C',
          dataIndex: 'tipo_cambio',
          key: 'tipo_cambio'
        },
        {
          title: 'Haber $',
          dataIndex: 'haber_dolares',
          key: 'haber_dolares'
        },
        {
          title: 'Debe $',
          dataIndex: 'debe_dolares',
          key: 'debe_dolares'
        },
        {
          title: 'Glosa',
          dataIndex: 'observacion',
          key: 'observacion'
        },
        {
          title: 'F. Venc.',
          dataIndex: 'fecha_vencimiento',
          key: 'fecha_vencimiento'
        }
      ]
    return(
        <Table 
        columns={columns} 
        dataSource={data} scroll={{ x: "max-content" }} rowKey={(record) => `${record.id}`}  size="small"/>
    )
}
export default TableItemList