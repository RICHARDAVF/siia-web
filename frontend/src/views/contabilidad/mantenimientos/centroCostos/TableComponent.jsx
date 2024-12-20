import { Table, Popconfirm } from "antd"
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa"
import { forwardRef, useRef } from "react";
const CustomPopconfirm = forwardRef((props, ref) => (<Popconfirm ref={ref} {...props}> {props.children} </Popconfirm>));

export const TableComponent = (props) => {
    const { data, deleteItem, getCentroCostos } = props
    const columns = [
        {
            title: 'Opcion',
            key: 'editar',
            render: (row) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '60px' }}>
                        <FaEdit style={{ color: 'green', cursor: 'pointer' }}
                            onClick={() => getCentroCostos(row, 1)} />

                        <CustomPopconfirm
                            title='¿Esta seguro de eliminar el registro?'
                            onConfirm={() => deleteItem(row)}
                            okText={'Si'}
                            cancelText={'No'}
                        >
                            <FaTrash style={{ color: 'red', cursor: 'pointer' }} />
                        </CustomPopconfirm>
                    </div>
                )
            }
        },
        {
            title: 'Codigo',
            dataIndex: 'cco_codigo',
            key: 'cco_codigo'
        },
        {
            title: 'Nombre',
            dataIndex: 'cco_nombre',
            key: 'cco_nombre'
        },
        {
            title: 'Cuenta',
            dataIndex: 'pla_cuenta',
            key: 'pla_cuenta'
        },
        {
            title: 'Aplica a Gastos de ventas',
            //dataIndex: 'cco_aplica',
            key: 'cco_aplica',
            render: (row) => {
                if (row.cco_aplica == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        },
        {
            title: 'C.C. Anterior',
            dataIndex: 'canterior',
            key: 'canterior'
        },
        {
            title: 'Estado de GG y PP',
            //dataIndex: 'cco_eegg01',
            key: 'cco_eegg01',
            render: (row) => {
                return row.cco_incigv == 1 ? 'Gastos Directos' : row.cco_incigv == 2 ? 'Gastos Indirectos' : row.cco_incigv == 3 ? 'Gastos Flujos' : ""
            }
        },
        {
            title: 'Incluye IGV',
            //dataIndex: 'cco_incigv',
            key: 'cco_incigv',
            render: (row) => {
                if (row.cco_incigv == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        },
        {
            title: 'Servicio',
            //dataIndex: 'cco_servi',
            key: 'cco_servi',
            render: (row) => {
                if (row.cco_servi == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        },
        {
            title: 'C. Presupuestal',
            dataIndex: 'pre_scta',
            key: 'pre_scta',
        },
        {
            title: 'Aplica a Presupuesto',
            //dataIndex: 'cco_presup',
            key: 'cco_presup',
            render: (row) => {
                if (row.cco_presup == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        },
        {
            title: 'Varios',
            dataIndex: 'cco_activo',
            key: 'cco_activo',
            render: (row) => {
                if (row.cco_activo == 1) {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <FaCheck style={{ color: 'green' }} />
                        </div>
                    )
                } else {
                    return ''
                }
            }
        },
        {
            title: 'Desactivado',
            //dataIndex: 'cco_varios',
            key: 'cco_varios',
            render: (row) => {
                if (row.cco_varios == 1) {
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