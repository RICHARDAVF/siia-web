from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from rest_framework import status
from core.conn import DataBase
from datetime import datetime
class ListComprasView(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs["document"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"""
                SELECT distinct a.MOV_FECHA,a.mov_mes,a.ORI_CODIGO,a.MOV_COMPRO, 
                    a.MOV_SERIE,a.MOV_DOCUM,c.AUX_RAZON,c.AUX_DOCUM,a.mov_total,a.MOV_GLOSA 
                FROM mova2024 AS a
                LEFT JOIN t_origen AS b ON a.ORI_CODIGO = b.ori_codigo
                LEFT JOIN t_auxiliar AS c ON a.AUX_CLAVE = c.AUX_CLAVE
                WHERE b.ori_tipo = ?
                ORDER BY a.MOV_FECHA,a.MOV_COMPRO ASC
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
            sql = f"""INSERT INTO MOVA{self.fecha.year}(
            alm_codigo,mov_mes,ORI_CODIGO,UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,AUX_CLAVE,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas
            ) VALUES """
            correlativo = '001-0000001'
            for item in datos['items']:
                params = ("53",str(self.fecha.month).zfill(2),datos['origen'],datos['ubicacion'],correlativo,self.fecha.strftime("%Y-%m-%d"),item['observacion'],item['cuenta'],datos['proveedor'],datos['tipo_documento'],datos['numero_serie'],datos['numero_documento'],item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],datos['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],datos['codigo_vendedor'],datos['tipo_asiento'])
                sql1 = sql+f"({','.join('?' for i in params)})"
                self.query(document,sql1,params,'POST')
            return Response({'success':"Los datos se guardaron correctamente"},status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({"error":f"Ocurrio un error: {str(e)}"},status= status.HTTP_500_INTERNAL_SERVER_ERROR)
    def validate(self):
        pass