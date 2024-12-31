import { Table } from "antd"

const ListMensual=({data})=>{
    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
        
        },
        {
            title:'T.D',
            dataIndex:'tipo_documento',
            key:'tipo_documento',
        },
        {
            title:'Serie/Numero',
            render:(row)=>(
                <div>{row.serie}-{row.numero_documento}</div>
            )
        },
        {
            title:'Razon Social',
            dataIndex:'razon_social',
            key:'razon_social',
        },
        {
            title:'RUC',
            dataIndex:'ruc_dni',
            key:'ruc_dni',
        },
        {
            title:'B.I',
            dataIndex:'base_imponible',
            key:'base_imponible',
            align:'right'

        },
        {
            title:'Inafecto',
            dataIndex:'inafecto',
            key:'inafecto', 
            align:'right'

        },
        {
            title:'IGV',
            dataIndex:'igv',
            key:'igv',
            align:'right'

        },
        {
            title:'Total',
            dataIndex:'total',
            key:'total',
            align:'right',
            render:(_,row)=>(
                <div style={{background:row.total>1000?'#9afc5a':row.total>500?'#f4fda5':'#fc988c',width:'100%'}}>
                    {row.total}
                </div>
            )
        },
        {
            title:'T/C',
            dataIndex:'tipo_cambio',
            key:'tipo_cambio',
            align:'right'

        }
    ]
    return(
        <Table 
        dataSource={data} 
        columns={columns} 
        rowKey={record=>record.id} 
        size="small" 
        scroll={{x:'max-content'}}
        rowClassName={(record)=>record.state?'row-red':''}
        />
    )
}
export default ListMensual