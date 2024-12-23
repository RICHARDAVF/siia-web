import { Table } from "antd"

const TableComponent=({data,editItem,deleteItem})=>{
    const columns = [
        {
            title:'Opcion',
            render:(record)=>(
                <div>codigo</div>
            )
        },
        {
            title:'Codigo',
            dataIndex:'comprobante',
            key:'comprobante'
        },
        {
            title:'Cliente',
            dataIndex:'codigo_cliente',
            key:'codigo_cliente'
        },
        {
            title:'Fecha',
            dataIndex:'fecha',
            key:'fecha'
        },
        {
            title:'Articulo',
            dataIndex:'codigo_articulo',
            key:'codigo_articulo'
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad'
        },
        {
            title:'Precio',
            dataIndex:'precio_unitario',
            key:'precio_unitario'
        },
        {
            title:'Total',
            dataIndex:'valor',
            key:'valor'
        }
    ]
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>record.id} size="small"/>
    )
}
export default TableComponent