from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from core.conn import DataBase
from config.middleware import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import datetime
# Create your views here.
class ListOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            documnet = kwargs["document"]
            query_string = request.data["query_string"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"SELECT ori_codigo,ori_nombre FROM t_origen WHERE ori_tipo=? AND (ori_nombre LIKE '%{query_string}%' OR ori_codigo LIKE '%{query_string}%') "
            res = self.query(documnet,sql,(tipo_origen,),"GET",1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error: {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
class ListUbicacion(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwagrs):
        try:
            document = kwagrs['document']
            sql = "SELECT ubi_codigo,ubi_nombre FROM t_ubicacion"
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]

            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error":f"Ocurrio un error :{str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ListProveedor(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            query_string = request.data['query_string']
            sql =f""" SELECT TOP 10
                            AUX_DOCUM,
                            AUX_RAZON
                        FROM t_auxiliar 
                        WHERE 
                            MAA_CODIGO='PR' 
                            AND ELIMINI=0 
                            AND (
                                AUX_DOCUM LIKE '%{query_string}%'
                                OR AUX_RAZON LIKE '%{query_string}%'
                            )"""
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
                
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    "error":f"Ocurrio un error : {str(e)}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListDocument(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
           
            sql = f"""
                SELECT 
                    DOC_CODIGO,
                    DOC_NOMBRE,
                    DOC_SERIE 
                FROM t_documento 
                WHERE   
                    elimini=0
                   
            """
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":f"{value[0].strip()}-{value[2].strip()}",
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error":f"Ocurrio un error : {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListCentroCosto(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            sql = "SELECT cco_codigo,cco_nombre,pla_cuenta FROM t_ccosto"
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status = status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error":f"Ocurrio un error : {str(e)}"
            },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class ListCuentas(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha : datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        
        try:
            document = kwargs['document']
            query_string = request.data['query_string']
            sql = f"""
            SELECT 
                TOP 10
                pla_cuenta,
                pla_nombre,
                pla_moneda 
            FROM PLAN{self.fecha.year}
            WHERE 
                pla_cuenta LIKE '%{query_string}%'
                OR pla_nombre LIKE '%{query_string}%'
"""
            res = self.query(document,sql,(),'GET',1)
            data = [
                {
                    'id':index,
                    'value':value[0].strip(),
                    'label':value[1].strip(),
                    'moneda':value[2].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error':f'Ocurrio un un error :{str(e)}'
            },status = status.HTTP_500_INTERNAL_SERVER_ERROR)
