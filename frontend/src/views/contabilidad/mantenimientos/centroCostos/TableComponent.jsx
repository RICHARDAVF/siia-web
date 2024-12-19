import { Table } from "antd"

export const TableComponent = (props) => {
    const { data } = props
    const columns = [
        {
            title: 'Codigo',
            dataIndex: 'codigo',
            key: 'codigo'
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre'
        }
    ]

    return (
        <Table dataSource={data} columns={columns} rowKey={record => `${record.id}`} size="small" />
    )
}