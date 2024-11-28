from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from rest_framework import status
from core.conn import DataBase
from datetime import datetime
from core.views import GetAuxiliar
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
                params = ("53",str(self.fecha.month).zfill(2),datos['origen'],datos['ubicacion'],correlativo,self.fecha.strftime("%Y-%m-%d"),item['observacion'],item['cuenta'],auxiliar.codigo_cliente,tipo_documento,datos['numero_serie'],datos['numero_documento'],item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],datos['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],datos['codigo_vendedor'],datos['tipo_asiento'],suma_total,datos["fecha_emision"],item["moneda"],datos["fecha_vencimiento"],datos["dias"])
                sql1 = sql+f"({','.join('?' for i in params)})"
                self.query(document,sql1,params,'POST')
            return Response({'success':"Los datos se guardaron correctamente"},status=status.HTTP_200_OK)
        except Exception as e:

            return Response({"error":f"Ocurrio un error: {str(e)}"},status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    def validate(self):
        pass
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
class EditComprasView(GenericAPIView,DataBase):
    fecha : datetime = datetime.now()
    def get(self,request,*args,**kwargs):
        try:
            document = kwargs["document"]
            mes,origen,comporbante = kwargs["query_string"]
            sql = f"""
                    SELECT 
                        UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,aux_clave,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas,mov_total,mov_femisi,mov_moned,mov_fvenc,mov_diapag
                    FROM MOVA{self.fecha.year}
                    WHERE   
                        mov_mes=?
                        AND ori_codigo=?
                        AND mov_compro=?
            """
            headers = res[0]
            data = {
            }
            params = (mes,origen,comporbante)
            res = self.query(document,sql,params,"GET",1)
        except Exception as e:
            return Response({"error":f"Ocurrio un error al recuperar la data:{str(e)}"})
