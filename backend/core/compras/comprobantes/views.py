from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from core.conn import DataBase
from config.middleware import TokenAuthentication
from datetime import datetime

class ListComprobantes(GenericAPIView,DataBase):
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
                WHERE b.ori_tipo = 1
                ORDER BY a.MOV_FECHA DESC
"""
            params = (tipo_origen,)
            res  = self.query(document,sql,(),"GET",1)
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