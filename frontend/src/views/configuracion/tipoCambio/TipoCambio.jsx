import { InputNumber, DatePicker, Row, Button, Col, Table, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import config from '../../../config';
import { Context } from '../../../components/GlobalContext';

const TipoCambio = () => {
    const [fecha, setFecha] = useState(dayjs())
    const [compra, setCompra] = useState(0)
    const [venta, setVenta] = useState(0)
    const [cierreCompra, setCierreCompra] = useState(0)
    const [cierreVenta, setCierreVenta] = useState(0)
    const [fechaFiltro, setFechaFiltro] = useState()
    const [data, setData] = useState([])
    const { token, document, user } = useContext(Context)
    const { BASE_URL } = config

    useEffect(() => {
        getTipoCambio(2)
    }, [])

    const onChangeFecha = (e) => {
        setFecha(e)
    }
    const onChangeCompra = (e) => {
        setCompra(e)
    }
    const onChangeVenta = (e) => {
        setVenta(e)
    }
    const onChangeCierreCompra = (e) => {
        setCierreCompra(e)
    }
    const onChangeCierreVenta = (e) => {
        setCierreVenta(e)
    }
    const onChangeFechaFiltro = async (fechaFiltro) => {
        try {
            var nfecha = 'null'
            if (fechaFiltro) {
                nfecha = fechaFiltro.format('YYYY-MM-DD')
            }
            const url = `${BASE_URL}/api/v1/compras/save/tipo-cambio/${document}/${nfecha}/0/`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await response.json()
            setData(result.tipo_cambio)
        } catch (error) {
            message.error(error.toString())
        }
    }

    const getTipoCambio = async (option) => {
        try {
            var nfecha = 'null'
            if (option == 1) {
                nfecha = fecha.format('YYYY-MM-DD')
            }


            const url = `${BASE_URL}/api/v1/compras/save/tipo-cambio/${document}/${nfecha}/${option}/`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await response.json()
            if (option == 1) {
                setCompra(('compra' in result) ? result.compra : '0')
                setVenta(('venta' in result) ? result.venta : '0')
            } else {
                setData(result.tipo_cambio)
            }
        } catch (e) {
            message.error(e)
        }
    }

    const saveTipoCambio = async () => {
        try {
            const nfecha = fecha.format('YYYY-MM-DD')
            const url = `${BASE_URL}/api/v1/compras/save/tipo-cambio/${document}/${nfecha}/0/`
            const datos = {
                "fecha": nfecha,
                "venta": venta,
                "compra": compra,
                "cierreCompra": cierreCompra,
                "cierreVenta": cierreVenta,
                "usuario": user.codigo_usuario
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            const result = await response.json()

            if (result.tipo_cambio) {
                setData(result.tipo_cambio)
            }

            if (result.success) {
                message.success(result.success)
            }

            if (result.error) {
                message.error(result.error)
            }
        } catch (e) {
            message.error(e)
        }
    }

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha'
        },
        {
            title: 'Compra',
            dataIndex: 'compra',
            key: 'compra'
        },
        {
            title: 'Venta',
            dataIndex: 'venta',
            key: 'venta'
        },
        {
            title: 'Cierre Compras',
            dataIndex: 'cierreCompra',
            key: 'cierreCompra'
        },
        {
            title: 'Cierre Ventas',
            dataIndex: 'cierreVenta',
            key: 'cierreVenta'
        }
    ]

    return (
        <div style={{ margin: 50, display: 'block', flexDirection: 'column' }}>
            <Row style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Col style={{ width: '50%' }}>
                    <Row style={{ width: 400 }} gutter={16}>
                        <Col style={{ justifyContent: 'space-between', width: '60%' }}>
                            <label>Fecha</label>
                            <DatePicker onChange={onChangeFecha} defaultValue={fecha} />
                        </Col>
                        <Col style={{ width: '40%', display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => getTipoCambio(1)}>T.C.</Button>
                            <Button onClick={saveTipoCambio}>GUARDAR</Button>
                        </Col>
                    </Row>

                    <Row style={{ width: 200, justifyContent: 'space-between' }}>
                        <label>Compra</label>
                        <InputNumber min={0} max={10} defaultValue={0} value={compra} onChange={onChangeCompra} />
                    </Row>

                    <Row style={{ width: 200, justifyContent: 'space-between' }}>
                        <label>Venta</label>
                        <InputNumber min={0} max={10} defaultValue={0} value={venta} onChange={onChangeVenta} />
                    </Row>

                    <Row style={{ width: 200, justifyContent: 'space-between' }}>
                        <label>Cierre Compra</label>
                        <InputNumber min={0} max={10} defaultValue={0} value={cierreCompra} onChange={onChangeCierreCompra} />
                    </Row>

                    <Row style={{ width: 200, justifyContent: 'space-between' }}>
                        <label>Cierre Venta</label>
                        <InputNumber min={0} max={10} defaultValue={0} value={cierreVenta} onChange={onChangeCierreVenta} />
                    </Row>
                </Col>
                <Col style={{ width: '50%' }}>
                    <label style={{ marginRight: 20 }}>Fecha</label>
                    <DatePicker onChange={onChangeFechaFiltro} />
                    <Table size='small' style={{ width: '100%' }} columns={columns} dataSource={data} rowKey={record => record.id} />
                </Col>
            </Row>
        </div>
    );
}
export default TipoCambio