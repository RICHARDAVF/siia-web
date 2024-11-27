from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from config.middleware import TokenAuthentication
from core.conn import DataBase
class ListAsientosView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    def post(self,request,*args,**kwargs):
        document = kwargs['document']
        try:
            sql = f"""
            SELECT distinct a.MOV_FECHA,a.MOV_MES,a.ORI_CODIGO,a.MOV_COMPRO,a.MOV_GLOSA FROM mova2024 AS a 
            LEFT JOIN t_origen AS b ON a.ORI_CODIGO = b.ori_codigo 
            WHERE b.ori_tipo=3
            ORDER BY a.MOV_MES,a.ORI_CODIGO,a.MOV_COMPRO ASC
"""
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "fecha":self.processa_date(value[0]),
                    "mes":value[1],
                    "origen":value[2],
                    "comprobante":value[3],
                    "observacion":value[4].strip(),
    
                } for value in res
            ]
            return Response({"data":data},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":"Ocurrio un error:" +str(e)},status=status.HTTP_400_BAD_REQUEST)
    def processa_date(self,date):
        try:
            fecha = date.strftime("%Y-%m-%d")
            return fecha
        except:
            return date
    def get(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            mes = kwargs['mes']
            origen = kwargs['origen']
            comprobante = kwargs['compro']
            return Response()
        except:
            return Response() 
        