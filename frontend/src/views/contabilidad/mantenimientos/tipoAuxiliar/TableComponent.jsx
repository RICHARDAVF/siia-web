import { Table } from "antd"
import { FaCheck } from "react-icons/fa"

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
        },
        {
            title: 'Correlativo',
            //dataIndex: 'correlativo',
            key: 'correlativo',
            render: (row) => {
                if (row.correlativo == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        }
    ]

    return (
        <Table scroll={{ x: 'max-content' }} dataSource={data} columns={columns} rowKey={record => `${record.id}`} size="small" />
    )
}