import { Table } from "antd"

const TableComponent=({data,editItem,deleteItem})=>{
    const columns = []
    return(
        <Table dataSource={data} columns={columns} rowKey={record=>record.id}/>
    )
}
export default TableComponent