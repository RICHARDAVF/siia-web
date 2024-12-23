import { Button, Form, message, Row, Table } from "antd"
import { useContext, useEffect, useState } from "react"
import { REPORTE_REGISTRO_VENTAS } from "../../../../service/urls"
import { Context } from "../../../components/GlobalContext"
import { apiRegistroVentas } from "../../../../api/reportes/apiRegistroVentas"
import Loading from "../../../components/Loading"
import { FaFilePdf } from "react-icons/fa"
import { Page,Document,Text,pdf,View } from "@react-pdf/renderer"
import dayjs from 'dayjs'
import ModalConfigReport from "./ModalConfigReport"
import FormList from "antd/es/form/FormList"
import endpointsGenerics from "../../../../api/generics/Endpoints"
const MyPDF=({data,fecha,hora})=>{

    return(

        <Document>
            <Page size={'A4'} style={{paddingHorizontal:7,paddingVertical:10}}>
                <View style={{width:'100%'}} fixed>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{fontSize:12}}>
                            <Text>GRUPO KA</Text>
                            <Text>USUARIO:SOPORTE</Text>
                            <Text>REPORTE: VENTAS</Text>
                        </View>
                        <View style={{fontSize:12,justifyContent:'center',alignItems:'center'}}>
                            <Text>REGISTRO DE VENTAS</Text>
                            <Text render={({pageNumber,totalPages})=>(`Página ${pageNumber} de ${totalPages}` )} fixed style={{textAlign:'center'}}/>
                        </View>
                        <View style={{fontSize:12}}>
                            <Text>FECHA:{fecha}</Text>
                            <Text>HORA:{hora}</Text>
                        </View>
                    </View>
    
                    <View style={{display:'flex',flexDirection:'row',fontSize:8,width:'100%',backgroundColor:'gray',color:'white',fontWeight:'bold'}} >
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>FECHA</Text>
                        <Text style={{width:'4%',fontWeight:'bold',textAlign:'center'}}>T.D</Text>
                        <Text style={{width:'7%',fontWeight:'bold',textAlign:'center'}}>SERIE-N°</Text>
                        <Text style={{width:'28%',fontWeight:'bold',textAlign:'center'}}>RAZON SOCIAL</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>RUC</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>B/IMP.</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>INAFECTO</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>IGV</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>TOTAL</Text>
                        <Text style={{width:'5%',fontWeight:'bold',textAlign:'center'}}>T.C</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center'}}>DOLARES</Text>
                    </View>
                </View>
                
                {Object.entries(data).map(([key,serie_document])=>{
                    var base_imponible = 0
                    var inafecto = 0
                    var igv = 0
                    var total = 0
                    var dolares = 0
                    return (
                        <View key={key}>
                        {serie_document.map(item=>{
                            total += parseFloat(item.total)
                            igv += parseFloat(item.igv)
                            inafecto += parseFloat(item.inafecto)
                            base_imponible += parseFloat(item.base_imponible)
                            dolares += parseFloat(item.dolares)
                             
                            return(
                            <View key={item.id} style={{display:'flex',flexDirection:'row',fontSize:8,width:'100%',height:12}}>
                                <Text style={{width:'8%'}}>{item.fecha}</Text>
                                <Text style={{width:'4%',textAlign:'center'}}>{item.tipo_documento}</Text>
                                <Text style={{width:'7%'}}>{item.serie}-{item.numero_documento}</Text>
                                <Text style={{width:'28%',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',}}  >{item.razon_social}</Text>
                                <Text style={{width:'8%'}}>{item.ruc_dni}</Text>
                                <Text style={{width:'8%',textAlign:'right'}}>{item.base_imponible}</Text>
                                <Text style={{width:'8%',textAlign:'right'}}>{item.inafecto}</Text>
                                <Text style={{width:'8%',textAlign:'right'}}>{item.igv}</Text>
                                <Text style={{width:'8%',textAlign:'right'}}>{item.total}</Text>
                                <Text style={{width:'5%',textAlign:'right'}}>{item.tipo_cambio}</Text>
                                <Text style={{width:'8%',textAlign:'right'}}>{item.dolares}</Text>
                            </View>
                            )
                        })}
                        <View style={{display:'flex',flexDirection:'row',width:'100%'}}>
                            <View style={{width:'8%'}}></View>
                            <View style={{width:'4%'}}></View>
                            <View style={{width:'7%'}}></View>
                            <View style={{width:'28%',justifyContent:'flex-end'}}>
                                <Text style={{textAlign:'right',fontSize:8,color:'blue',fontWeight:'bold'}}>TOTAL S/ </Text>
                            </View>
                            <View style={{width:'8%'}}>
                            </View>
                            <View style={{width:'8%',justifyContent:'flex-end'}}>
                                <Text style={{fontSize:8,textAlign:'right',color:'blue',fontWeight:'bold'}}>{base_imponible.toFixed(2)}</Text>
                            </View>
                            <View style={{width:'8%',justifyContent:'flex-end'}}>
                                <Text style={{fontSize:8,textAlign:'right',color:'blue',fontWeight:'bold'}}>{inafecto.toFixed(2)}</Text>
                            </View>
                            <View style={{width:'8%',justifyContent:'flex-end'}}>
                                <Text style={{fontSize:8,textAlign:'right',color:'blue',fontWeight:'bold'}}>{igv.toFixed(2)}</Text>
                            </View>
                            <View style={{width:'8%',justifyContent:'flex-end'}}>
                                <Text style={{fontSize:8,textAlign:'right',color:'blue',fontWeight:'bold'}}>{total.toFixed(2)}</Text>
                            </View>
                            <View style={{width:'5%'}}></View>
                            <View style={{width:'8%',justifyContent:'flex-end'}}>
                                <Text style={{fontSize:8,textAlign:'right',color:'blue',fontWeight:'bold'}}>{dolares.toFixed(2)}</Text>
                            </View>
                        </View>
                        <View style={{borderWidth:1,borderColor:'black',width:'100%'}}></View>
                        </View>
                    )
                }
                )}
            </Page>
        </Document>
    )
    }
    

const RegistroVentas=()=>{
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [openModal,setOpenModal] = useState(false)
    const [origen,setOrigen] = useState([])
    const [MyForm] = Form.useForm()
    const {document,token} = useContext(Context)
    const datetime =dayjs()
    const fecha = datetime.format("YYYY-MM-DD")
    const hora = datetime.format('HH:MM:SS')
    useEffect(()=>{
        requestRegistroVentas()
        requestGeneric()

    },[])
    const requestGeneric=async()=>{
        try{
            const datos = {
                'query_string':'',
                'tipo_origen':3,
                "dates":['origen']
            }
            const response = await endpointsGenerics.ManyData.post(document,token,datos)
    
            if(response.success){
                setOrigen(response.origen)
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
    const requestRegistroVentas=async()=>{
        try{
            const form_values = MyForm.getFieldsValue()

            setLoading(true)
            const url = REPORTE_REGISTRO_VENTAS(document)
            const datos = {
                "mes":form_values.mes || 1,
            }
       
            const res = await apiRegistroVentas.post(url,token,datos)
            if (res.success){
                setData(res.data)
            }
            if(res.error){
                message.error(res.error)
            }
            
        }catch(erro){
            message.error(erro.toString())            
        }finally{
            setLoading(false)
        }
    }
    const onCancel=()=>{
        setOpenModal(!openModal)
    }

    const groupData=(array)=>{
        return array.reduce((acc,obj)=>{
            const key = "'"+obj.tipo_documento+"-"+obj.serie+"'"
            if(!acc[key]){
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        },{})
    }
    const onRequestData=async(values)=>{
        requestRegistroVentas()
        onCancel()
    }
    const genPDF=async(data)=>{
        setLoading(true)
        const datos = groupData(data)
        const doc = <MyPDF data={datos}fecha={fecha} hora={hora}/>
        const asPDF = pdf([])
        asPDF.updateContainer(doc)
        const blob = await asPDF.toBlob()
        const url = URL.createObjectURL(blob)
        window.open(url,'_blank')
        setLoading(false)
    }
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
            align:'right'
        },
        {
            title:'T/C',
            dataIndex:'tipo_cambio',
            key:'tipo_cambio',
            align:'right'

        }
    ]
    const contextModal={
        open:openModal,
        onCancel,
        MyForm,
        onRequestData,
        origen
    }
    return(
        <div style={{position:'relative'}}>
            <Row>
                <FaFilePdf style={{color:'red',cursor:'pointer'}} onClick={()=>genPDF(data)} size={20}/>
                <Button onClick={onCancel} style={{background:'blue',color:'white',fontWeight:'bold'}} size="small">
                    Filtros
                </Button>
            </Row>
            <Table dataSource={data} columns={columns} rowKey={record=>record.id} size="small" scroll={{x:'max-content'}}/>
            <ModalConfigReport {...contextModal}/>
            <Loading status={loading}/>
        </div>
    )
}
export default RegistroVentas