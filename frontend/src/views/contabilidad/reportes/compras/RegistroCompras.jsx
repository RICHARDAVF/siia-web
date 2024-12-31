import { useContext, useEffect, useState } from "react"
import Loading from "../../../../components/Loading"
import ModalConfigCompras from "./ModalConfigCompras"
import { Button, Form, message, Row } from "antd"
import { Context } from "../../../../components/GlobalContext"
import { FaFilePdf } from "react-icons/fa"
import ListCompras from "./ListCompras"
import CustomPDF from "./CustomPDF"
import { pdf } from "@react-pdf/renderer"
import { REPORTE_REGISTRO_COMPRAS } from "../../../../../service/urls"
import { apiRegistroCompras } from "../../../../../api/reportes/apiRegistroCompras"
import endpointsGenerics from "../../../../../api/generics/Endpoints"
import dayjs from "dayjs"
const RegistroCompras = () => {
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [centroCostos, setCentroCostos] = useState([])
    const [MyForm] = Form.useForm()
    const { document, token, user } = useContext(Context)
    const [origen, setOrigen] = useState([])
    const [data, setData] = useState([])
    const datetime =dayjs()
    const fecha = datetime.format("YYYY-MM-DD")
    const hora = datetime.format('HH:mm:ss')
    useEffect(() => {
        requestRegistroCompras(false)
        requestGeneric()
    }, [])
    const onCancel = () => {
        setOpenModal(!openModal)
    }
    const onRequestData = async (values) => {
        requestRegistroCompras(values)
        onCancel()
    }
    const requestGeneric=async()=>{
        try{
            const datos = {
                'query_string':'',
                'tipo_origen':3,
                "dates":['origen','centro-costos']
            }
            const response = await endpointsGenerics.ManyData.post(document,token,datos)
            if(response.success){
                setOrigen(response.origen)
                setCentroCostos(response.centro_costo)
            }
            if(response.error){
                message.error(response.error)
            }
        }catch(err){
            message.error(err.toString())
        }finally{
            setLoading(false)
        }
    }
    const requestRegistroCompras = async (values) => {
        try {
            setLoading(true)
            var form_values = {
                'mes': 1,
                'titulo_gratuito': false,
                'origen': '',
                'condicion': 1,
                'tipo_origen': 1
            }
            if (values) {
                form_values = { ...values, 'tipo_origen': 1 }
            }
            const url = REPORTE_REGISTRO_COMPRAS(document)
            const res = await apiRegistroCompras.post(url, token, form_values)
 
            if (res.success) {
                setData(res.data)
            }
            if (res.error) {
                message.error(res.error)
            }
        } catch (erro) {
            message.error(erro.message)
        } finally {
            setLoading(false)
        }
    }
    const groupData=(array,values)=>{
        return array.reduce((acc,obj)=>{
            var key = "00"
            if(values.ordenamiento==1){
                key = "'"+obj.serie+"'"
            }else if(values.ordenamiento==2){
                key="'"+obj.tipo_documento+"'"
            }else{
                key="'"+obj.tipo_documento+"-"+obj.serie+"'"
            }
            if(!acc[key]){
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        },{})
    }
    const contextModal = {
        open: openModal,
        onCancel,
        MyForm,
        onRequestData,
        origen,
        centroCostos

    }
    const meses = {
        '1': 'Enero',
        '2': 'Febrero',
        '3': 'Marzo',
        '4': 'Abril',
        '5': 'Mayo',
        '6': 'Junio',
        '7': 'Julio',
        '8': 'Agosto',
        '9': 'Septiembre',
        '10': 'Octubre',
        '11': 'Noviembre',
        '12': 'Diciembre'
    }
    const tipo_agrupamiento = {
        '1': 'Por Comprobante',
        '2': 'Por Tipo Documento',
    }
    const condicion = {
        '1': 'Mensual',
        '2': 'Acumulado',
    }
    const genPDF = async (data) => {
        const values = MyForm.getFieldsValue()
        var string_condicion = 'Mensual '
        var string_mes = 'Enero '
        if(values.condicion){
            string_condicion = `${condicion[`${values.condicion}`]} `
        }
        if(values.mes){
            string_mes = `${meses[`${values.mes}`]} `
        }

        const conector = (values.condicion==undefined || values.condicion==1)?'de ':'hasta '
        const title = `${string_condicion} ${conector} ${string_mes} `

        const datos = groupData(data,values)
        const doc = <CustomPDF data={datos} fecha={fecha} hora={hora} user={user} title={title} />
        const asPDF = pdf([])
        asPDF.updateContainer(doc)
        const blob = await asPDF.toBlob()
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setLoading(false)
    }
    return (
        <div style={{ position: 'relative' }}>
            <Row>
                <Button onClick={onCancel} style={{ background: 'blue', color: 'white', fontWeight: 'bold' }} size="small">
                    Filtros
                </Button>
                <Button size="small" onClick={() => {
                    setLoading(true);
                    genPDF(data);
                    }} >
                    <FaFilePdf color="red" />
                </Button>
            </Row>
            <ListCompras data={data} />
            <ModalConfigCompras {...contextModal} />
            <Loading status={loading} />

        </div>
    )
}

export default RegistroCompras