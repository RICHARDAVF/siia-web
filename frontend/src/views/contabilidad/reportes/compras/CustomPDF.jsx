import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
const styles = StyleSheet.create({
    page:{
        paddingHorizontal:7,
        paddingVertical:10
    },
    view:{
        justifyContent:'space-between',
        flexDirection:'row',
        display:'flex'
    }
})
const CustomPDF=({data,user,fecha,hora,title})=>{
    return(
        <Document  >
            <Page size={'A4'} style={{paddingHorizontal:7,paddingVertical:10}} >
                <View style={{width:'100%'}} fixed>
                    <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{fontSize:10,textAlign:'left'}}>
                            <Text>{user.razon_social}</Text>
                            <Text>USUARIO:{user.username}</Text>
                            <Text>REPORTE:COMPRAS</Text>
                        </View>
                        <View style={{fontSize:10,justifyContent:'center',alignItems:'center'}}>
                            <Text>REGISTRO DE COMPRAS</Text>
                            <Text>{title}</Text>
                            <Text render={({pageNumber,totalPages})=>(`Página ${pageNumber} de ${totalPages}`)} fixed style={{textAlign:'center'}} />
                        </View>
                        <View style={{fontSize:10,textAlign:'right'}} >
                            <Text>FECHA :{fecha}</Text>
                            <Text>HORA : {hora}</Text>
                        </View>
                    </View>
                    <View style={{fontSize:8,display:'flex',flexDirection:'row',backgroundColor:'gray',fontWeight:'bold',color:'white'}}>
                        <Text style={{width:'3%'}}>OR.</Text>
                        <Text style={{width:'4%'}}>COM:</Text>
                        <Text style={{width:'11%'}}>SER/NUM</Text>
                        <Text style={{width:'8%'}}>FECHA</Text>
                        <Text style={{width:'3%'}}>T.D</Text>
                        <Text style={{width:'25%',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>RAZON SOCIAL</Text>
                        <Text style={{width:'6%'}}>RUC</Text>
                        <Text style={{width:'11%',textAlign:'right'}}>B.I</Text>
                        <Text style={{width:'8%',textAlign:'right'}}>INAFECTO</Text>
                        <Text style={{width:'6%',textAlign:'right'}}>IGV</Text>
                        <Text style={{width:'8%',textAlign:'right'}}>TOTAL</Text>
                        <Text style={{width:'7%',textAlign:'right'}}>DOLARES</Text>
                    </View>
                </View>
                {Object.entries(data).map(([key,values])=>{
                    var total_base_imponible = 0
                    var total_inafecto = 0
                    var total_igv = 0
                    var total_total = 0
                    var total_dolares = 0
                    return(
                        <View key={key} style={{display:'flex',flexDirection:'column'}}>
                            {values.map(item=>{
                                total_base_imponible+=parseFloat(item.base_imponible)
                                total_inafecto+=parseFloat(item.inafecto)
                                total_igv+=parseFloat(item.igv)
                                total_total+=parseFloat(item.total)
                                total_dolares+=parseFloat(item.dolares)
                                return(
                                    <View key={item.id} style={{fontSize:8,width:'100%',marginBottom:5,height:10,display:'flex',flexDirection:'row'}}>
                                        <Text style={{width:'3%'}}>{item.origen}</Text>
                                        <Text style={{width:'4%'}}>{item.comprobante}</Text>
                                        <Text style={{width:'11%'}}>{item.serie}-{item.numero_documento}</Text>
                                        <Text style={{width:'8%'}}>{item.fecha}</Text>
                                        <Text style={{width:'3%'}}>{item.tipo_documento}</Text>
                                        <Text style={{width:'25%',textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{item.razon_social}</Text>
                                        <Text style={{width:'6%'}}>{item.ruc_dni}</Text>
                                        <Text style={{width:'11%',textAlign:'right'}}>{(item.base_imponible).toFixed(2)}</Text>
                                        <Text style={{width:'8%',textAlign:'right'}}>{(item.inafecto).toFixed(2)}</Text>
                                        <Text style={{width:'6%',textAlign:'right'}}>{(item.igv).toFixed(2)}</Text>
                                        <Text style={{width:'8%',textAlign:'right'}}>{(item.total).toFixed(2)}</Text>
                                        <Text style={{width:'7%',textAlign:'right'}}>{(item.dolares).toFixed(2)}</Text>
                                    </View>
                                )
                            })}
                            <View style={{fontSize:8,color:'blue',display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderStyle:'solid'}}>
                                <View style={{width:'54%'}}></View>
                                <View style={{width:'6%'}}>
                                    <Text>TOTAL S/</Text>
                                </View>
                                <Text style={{textAlign:'right',width:'11%'}}>{total_base_imponible.toFixed(2)}</Text>
                                <Text style={{textAlign:'right',width:'8%'}}>{total_inafecto.toFixed(2)}</Text>
                                <Text style={{textAlign:'right',width:'6%'}}>{total_igv.toFixed(2)}</Text>
                                <Text style={{textAlign:'right',width:'8%'}}>{total_total.toFixed(2)}</Text>
                                <Text style={{textAlign:'right',width:'7%'}}>{total_dolares.toFixed(2)}</Text>
                            </View>
                        </View>
                    )

                })}
            </Page>
        </Document>
    )
}
export default CustomPDF