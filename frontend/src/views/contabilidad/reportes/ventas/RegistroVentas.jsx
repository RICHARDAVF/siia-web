import { Button, Form, message, Row, Table } from "antd"
import { useContext, useEffect, useState } from "react"
import { REPORTE_REGISTRO_VENTAS } from "../../../../../service/urls"
import { Context } from "../../../../components/GlobalContext"
import { apiRegistroVentas } from "../../../../../api/reportes/apiRegistroVentas"
import Loading from "../../../../components/Loading"
import { FaFilePdf } from "react-icons/fa"
import { Page,Document,Text,pdf,View } from "@react-pdf/renderer"
import dayjs from 'dayjs'


import endpointsGenerics from "../../../../../api/generics/Endpoints"
import ListMensual from "./ListMensual"
import ModalConfigVentas from "./ModalConfigVentas"

const MyPDF=({data,fecha,hora,user})=>{
    var total_acumulado = 0
    return(

        <Document>
            <Page size={'A4'} style={{paddingHorizontal:7,paddingVertical:10,}}>
                <View style={{width:'100%'}} fixed>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{fontSize:12}}>
                            <Text>{user.rezon_social}</Text>
                            <Text>USUARIO:{user.username}</Text>
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
    
                    <View style={{display:'flex',flexDirection:'row',fontSize:8,width:'100%',backgroundColor:'gray',color:'white',fontWeight:'bold',borderWidth:2}} >
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>FECHA</Text>
                        <Text style={{width:'4%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>T.D</Text>
                        <Text style={{width:'7%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>SERIE-N°</Text>
                        <Text style={{width:'28%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>RAZON SOCIAL</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>RUC</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>B/IMP.</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>INAFECTO</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>IGV</Text>
                        <Text style={{width:'8%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>TOTAL</Text>
                        <Text style={{width:'5%',fontWeight:'bold',textAlign:'center',borderRightWidth:2}}>T.C</Text>
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
                        <View key={key} style={{marginTop:3}}>
                        {serie_document.map(item=>{
                            total += parseFloat(item.total)
                            igv += parseFloat(item.igv)
                            inafecto += parseFloat(item.inafecto)
                            base_imponible += parseFloat(item.base_imponible)
                            total_acumulado += parseFloat(item.base_imponible)
                            dolares += parseFloat(item.dolares)
                             
                            return(
                            <View key={item.id} style={{display:'flex',flexDirection:'row',fontSize:8,width:'100%',height:12,marginTop:1,color:item.state?'red':'black'}}>
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
                <View style={{justifyContent:'center',width:'100%'}}>
                    <Text style={{fontWeight:'bold',fontSize:10,color:'blue',textAlign:'center'}}>Suma total S/: {total_acumulado.toFixed(2)}</Text>
                </View>
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
    const {document,token,user} = useContext(Context)
    const datetime =dayjs()
    const fecha = datetime.format("YYYY-MM-DD")
    const hora = datetime.format('HH:mm:ss')
    useEffect(()=>{
       
        requestGeneric()
        requestRegistroVentas(false)

    },[])
    const requestGeneric=async()=>{
        try{
            const datos = {
                'query_string':'',
                'tipo_origen':3,
                'ventas':1,
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
    const requestRegistroVentas=async(values)=>{

        try{
          
            var form_values = {
                'mes':1,
                'titulo_gratuito':false,
                'origen':'',
                'condicion':1,
                'ventas':1,
                'tipo_origen':3,
            }
            
            if(values){
                form_values = {...values,'ventas':1,'tipo_origen':3}
            }
            
            setLoading(true)
            const url = REPORTE_REGISTRO_VENTAS(document)
            const datos = {
                ...form_values

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
    const onRequestData=async(values)=>{
        requestRegistroVentas(values)
        onCancel()
    }
    const genPDF=async(data)=>{
        setLoading(true)
        const values = MyForm.getFieldsValue()
  
        const datos = groupData(data,values)
         
        const doc = <MyPDF data={datos}fecha={fecha} hora={hora} user={user}/>
        const asPDF = pdf([])
        asPDF.updateContainer(doc)
        const blob = await asPDF.toBlob()
        const url = URL.createObjectURL(blob)
        window.open(url,'_blank')
        setLoading(false)
    }

    const contextModal={
        open:openModal,
        onCancel,
        MyForm,
        onRequestData,
        origen
    }
    const mensualListContext = {
        data: data,

    }
    return(
        <div style={{position:'relative'}}>
            <Row>
                <Button onClick={onCancel} style={{background:'blue',color:'white',fontWeight:'bold'}} size="small">
                    Filtros
                </Button>
                <Button size="small" onClick={()=>genPDF(data)} >
                    <FaFilePdf color="red"/>
                </Button>
            </Row>
            <ListMensual {...mensualListContext}/>
            <ModalConfigVentas {...contextModal}/>
            <Loading status={loading}/>
        </div>
    )
}
export default RegistroVentas