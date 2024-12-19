import { Button, message } from "antd"
import { useContext, useEffect, useState } from "react"
import { TableComponent } from "./TableComponent"
import { LIST_CENTRO_COSTO, SAVE_CENTRO_COSTO } from "../../../../../service/urls"
import { Context } from "../../../../components/GlobalContext"
import ModalForm from "./ModalForm"

const ListCentroCostos = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { token, document, user } = useContext(Context)
    const [openModal, setOpenModal] = useState(false)

    const onCancel = () => {
        setOpenModal(!openModal)
    }

    useEffect(() => {
        getCentroCosto()
    }, [])

    const getCentroCosto = async () => {
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

    const saveCentroCosto = async (values) => {
        try {
            const datos = {
                ...values,
                "usuario": user.codigo_usuario
            }

            setLoading(true)
            const url = SAVE_CENTRO_COSTO(document)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            const response = await res.json()

            console.log(response)

            if (response.success) {
                onCancel();
                message.success(response.message)
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

    const editar = async (values) => {
        
    }

    return (
        <div style={{ position: 'relative' }}>
            <Button style={{ background: 'blue', color: 'white' }} onClick={onCancel}>
                Agregar
            </Button>
            <TableComponent data={data} />
            <ModalForm onCancel={onCancel} openModal={openModal} saveCentroCosto={saveCentroCosto} />
        </div>
    )
}

export default ListCentroCostos