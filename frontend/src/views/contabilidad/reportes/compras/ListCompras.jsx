import { render } from "@react-pdf/renderer"
import { Table } from "antd"

const ListCompras=({data})=>{
    const columns = [
        {
            title:'Origen',
            dataIndex:'origen',
            key:'origen'
        },
        {
            title:'Cromp.',
            dataIndex:'comprobante',
            key:'comprobante'
        },
        {
            title:'Fecha',
            dataIndex:'fecha',
            key:'fecha'
        },
        
        {
            title:'T.D',
            dataIndex:'tipo_documento',
            key:'tipo_documento'
        },
        {
            title:'Serie-Numero',
            key:'numero_documento',
            render:(record)=>(
                <span>{record.serie}-{record.numero_documento}</span>
            )
        },
        {
            title:'RUC',
            dataIndex:'ruc_dni',
            key:'ruc_dni'
        },
        {
            title:'Razon Social',
            dataIndex:'razon_social',
            key:'razon_social',
            width:'400px',
            render:(_,row)=>(
                <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:'400px'}} >
                    {row.razon_social}
                </div>
            )
        },
        {
            title:'Base Imp.',
            dataIndex:'base_imponible',
            key:'base_imponible'
        },
        {
            title:'IGV',
            dataIndex:'igv',
            key:'igv'
        },
        {
            title:'Total',
            dataIndex:'total',
            key:'total',
            render:(_,row)=>(
                <div style={{background:row.total>1000?'#9afc5a':row.total>500?'#f4fda5':'#fc988c',width:'100%'}}>
                    {row.total}
                </div>
            )
        },
        
    ]
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>record.id} size="small" scroll={{x:'max-content'}}/>
    )
}
export default ListCompras