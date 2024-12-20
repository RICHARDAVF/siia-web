import { Button, Form, message } from "antd"
import { useContext, useEffect, useState } from "react"
import { TableComponent } from "./TableComponent"
import { LIST_TIPO_AUXILIAR, SAVE_TIPO_AUXILIAR } from "../../../../../service/urls"
import { Context } from "../../../../components/GlobalContext"
import ModalForm from "./ModalForm."

const TipoAuxiliar = () => {
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
        ListTipoAuxiliar()
    }, [])

    const ListTipoAuxiliar = async () => {
        try {
            setLoading(true)
            const url = LIST_TIPO_AUXILIAR(document)
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log(res)

            const response = await res.json()
            console.log(response)

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

    const saveTipoAuxiliar = async (values) => {
        try {
            const datos = {
                ...values,
                "usuario": user.codigo_usuario
            }

            setLoading(true)

            //const url = modalMode == 0 ? SAVE_TIPO_AUXILIAR(document) : UPDATE_CENTRO_COSTO(document)
            const url = SAVE_TIPO_AUXILIAR(document)
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
                ListTipoAuxiliar()
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

    return (
        <div style={{ position: 'relative' }}>
            <Button style={{ background: 'blue', color: 'white' }} onClick={() => onCancel(0)}>
                Agregar
            </Button>
            <TableComponent data={data} />
            <ModalForm onCancel={onCancel} openModal={openModal} saveTipoAuxiliar={saveTipoAuxiliar} myForm={myForm} />
        </div>
    )
}
export default TipoAuxiliar