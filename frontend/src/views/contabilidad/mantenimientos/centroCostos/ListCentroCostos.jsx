import { Button, Form, message } from "antd"
import { useContext, useEffect, useState } from "react"
import { TableComponent } from "./TableComponent"
import { DELETE_CENTRO_COSTO, LIST_CENTRO_COSTO, SAVE_CENTRO_COSTO, UPDATE_CENTRO_COSTO } from "../../../../../service/urls"
import { Context } from "../../../../components/GlobalContext"
import ModalForm from "./ModalForm"

const ListCentroCostos = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { token, document, user } = useContext(Context)
    const [openModal, setOpenModal] = useState(false)
    const [myForm] = Form.useForm()
    const [modalMode, setModalMode] = useState(0)

    const onCancel = (option) => {
        setModalMode(option)
        setOpenModal(!openModal)
    }

    useEffect(() => {
        ListCentroCostos()
    }, [])

    const ListCentroCostos = async () => {
        try {
            setLoading(true)
            const url = LIST_CENTRO_COSTO(document)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await res.json()

            if (response.error) {
                message.error(response.error)
            }
            if (response.success) {
                setData(response.data)
            }
        } catch (err) {
            message.error(err.toString())
        }
    }

    const saveCentroCosto = async (values) => {
        try {
            const datos = {
                ...values,
                "usuario": user.codigo_usuario
            }

            setLoading(true)

            const url = modalMode == 0 ? SAVE_CENTRO_COSTO(document) : UPDATE_CENTRO_COSTO(document)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            const response = await res.json()

            if (response.success) {
                onCancel();
                message.success(response.message)
                ListCentroCostos()
                myForm.resetFields()
            }

            if (response.error) {
                message.error(response.error)
            }
        } catch (err) {
            message.error(err.toString())
        } finally {
            setLoading(false)
        }
    }

    const getCentroCostos = async (values, option) => {
        try {
            setLoading(true)
            const url = UPDATE_CENTRO_COSTO(document).replace('codigo', values.cco_codigo)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await res.json()

            if (response.error) {
                message.error(response.error)
            }
            if (response.success) {
                myForm.setFieldsValue(response.data)
                onCancel(option)
            }
        } catch (err) {
            message.error(err.toString())
        }
    }

    const deleteItem = async (values) => {
        try {
            const datos = {
                "cco_codigo": values.cco_codigo
            }

            setLoading(true)
            const url = DELETE_CENTRO_COSTO(document)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            const response = await res.json()

            if (response.success) {
                message.success(response.message)
                ListCentroCostos()
            }

            if (response.error) {
                message.error(response.error)
            }
        } catch (err) {
            message.error(err.toString())
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <Button style={{ background: 'blue', color: 'white' }} onClick={() => onCancel(0)}>
                Agregar
            </Button>
            <TableComponent data={data} deleteItem={deleteItem} getCentroCostos={getCentroCostos} />
            <ModalForm onCancel={onCancel} openModal={openModal} saveCentroCosto={saveCentroCosto} myForm={myForm} />
        </div>
    )
}

export default ListCentroCostos