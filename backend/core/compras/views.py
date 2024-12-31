from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from rest_framework import status
from core.conn import DataBase
from datetime import datetime
from core.views import GetAuxiliar
import requests
class ListComprasView(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha:datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs["document"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"""
                SELECT distinct a.MOV_FECHA,a.mov_mes,a.ORI_CODIGO,a.MOV_COMPRO, 
                    a.MOV_SERIE,a.MOV_DOCUM,c.AUX_RAZON,c.AUX_DOCUM,a.mov_total,a.MOV_GLOSA 
                FROM mova{self.fecha.year} AS a
                LEFT JOIN t_origen AS b ON a.ORI_CODIGO = b.ori_codigo
                LEFT JOIN t_auxiliar AS c ON a.AUX_CLAVE = c.AUX_CLAVE
                WHERE b.ori_tipo = ?
                ORDER BY a.MOV_FECHA DESC
"""
            params = (tipo_origen,)
            res  = self.query(document,sql,params,"GET",1)
            data = [
                {
                    "id":index,
                    "fecha":self.format_date(value[0]),
                    "mes":value[1].strip(),
                    "origen":value[2].strip(),
                    "comprobante":value[3],
                    "serie":value[4].strip(),
                    "numero":value[5],
                    "razon_social":value[6].strip(),
                    "ruc":value[7].strip(),
                    "total":f" {value[8]:.2f}",
                    "obs":value[9].strip(),
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def format_date(self,date:datetime):
        try:
            return date.strftime("%Y-%m-%d")
        except:
            return date
class SaveComporasView(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha :datetime = datetime.now() 
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            datos = request.data
            auxiliar = GetAuxiliar(document,self.query,datos["proveedor"])
            sql = f"""INSERT INTO MOVA{self.fecha.year}(
            alm_codigo,mov_mes,ORI_CODIGO,UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,aux_clave,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas,mov_total,mov_femisi,mov_moned,mov_fvenc,mov_diapag
            ) VALUES """
            correlativo = self.correlativo()
            for item in datos['items']:
                tipo_documento = datos["tipo_documento"].split("-")[0]
                suma_total = self.sum_total()
                params = ("53",str(self.fecha.month).zfill(2),datos['origen'],datos['ubicacion'],correlativo,datos['fecha_contable'],item['observacion'],item['cuenta'],auxiliar.codigo_cliente,tipo_documento,datos['numero_serie'],datos['numero_documento'],item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],datos['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],datos['codigo_vendedor'],datos['tipo_asiento'],suma_total,datos["fecha_emision"],item["moneda"],datos["fecha_vencimiento"],datos["dias"])
                sql1 = sql+f"({','.join('?' for i in params)})"
                self.query(document,sql1,params,'POST')
            return Response({'success':"Los datos se guardaron correctamente"},status=status.HTTP_200_OK)
        except Exception as e:

            return Response({"error":f"Ocurrio un error: {str(e)}"},status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    def sum_total(self):
        try:
            return sum([float(item["haber_soles"]) for item in self.request.data["items"]])
        except Exception as e:
            raise ValueError(str(e))
    def correlativo(self):
        try:
            params = (str(self.fecha.month).zfill(2),self.request.data["codigo_origen"])
            sql = f"SELECT MAX(mov_compro) FROM mova{self.fecha.year} WHERE mov_mes=? AND ori_codigo=?"
            res = self.query(self.kwargs["document"],sql,params,"GET",0)
            return int(res[0])+1
        except:
            return 1

class SaveTipoCambio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            data={}
            documento = kwargs["document"]
            fecha=request.data["fecha"]
            compra=request.data["compra"]
            venta=request.data["venta"]
            cierreCompra=request.data["cierreCompra"]
            cierreVenta=request.data["cierreVenta"]
            usuario=request.data["usuario"]

            if not self.validarTipoCambio(fecha):
                raise ValueError('Ya existe tipo de cambio para esta fecha')

            sql = """INSERT T_TCAMBIO(tc_fecha,tc_compra,tc_venta,tc_cierrc,tc_cierrv,tc_euro,usuario,fechausu)
            values (?,?,?,?,?,?,?,?)
            """
            params=(fecha,compra,venta,cierreCompra,cierreVenta,0,usuario,self.fecha)
            res=self.query(documento,sql,params,"POST")

            if res==-1:
                data['tipo_cambio']=self.getTipoCambioBD()
                data['success']='Se guardo con exito'
            else:
                data['error']='No se puedo guardar los datos'
            return Response(data)
        except Exception as e:
            return Response({"error":f"Ocurrio un error al guardar la data:{str(e)}"})
    
    def getTipoCambioSunat(self,fecha):
        try:
            url="https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha="+fecha
            result=requests.get(url)
            if result.status_code==200:
               
                return result.json()
        except Exception as e:
            raise ValueError(str(e))
        
    def get(self,request,*args,**kwargs):
        try:
            data={}
            option=kwargs["option"]
            if option==1:
                url="https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha="+kwargs["fecha"]
                result=requests.get(url)
                if result.status_code==200:
                    data=result.json()
                else:
                    data['error']='Error en la consulta'
            else:
                data['tipo_cambio']=self.getTipoCambioBD()
            return Response(data)
        except Exception as e:
            return Response({'error':str(e)})
    def validarTipoCambio(self,fecha):
        try:
            sql = "select tc_fecha from t_tcambio where tc_fecha=?"
            params=(fecha,)
            result=self.query(self.kwargs['document'],sql,params,"GET",0)
            return result is None
        except Exception as e:
            raise ValueError(str(e))
    def getTipoCambioBD(self):
        try:
            fechafiltro = self.kwargs["fecha"]
            print(fechafiltro)
            if fechafiltro=='null' :
                sql = "select top 200 tc_fecha,tc_compra,tc_venta,tc_cierrc,tc_cierrv from t_tcambio order by tc_fecha desc"
                params=()
            else :
                sql = "select tc_fecha,tc_compra,tc_venta,tc_cierrc,tc_cierrv from t_tcambio where tc_fecha=? order by tc_fecha desc"
                params=(fechafiltro,)
            
            result=self.query(self.kwargs['document'],sql,params,"GET",1)
            data=[
                {
                    'id':index,
                    'fecha':value[0].strftime('%Y-%m-%d'),
                    'compra':value[1],
                    'venta':value[2],
                    'cierreCompra':value[3],
                    'cierreVenta':value[4],
                }for index,value in enumerate(result)
            ]

            return data
        except Exception as e:
            raise ValueError(str(e))
