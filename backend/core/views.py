from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from core.conn import DataBase
from config.middleware import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import datetime

import requests
# Create your views here.
class TipoCambio:
    def __init__(self,document:str,user_codigo:str,query,fecha:datetime ):
        self.query = query
        self.document:str  = document
        self.user_codigo:str = user_codigo
        self.fecha:datetime = fecha 
        self.data:dict = {}
    def get_tipo_cambio(self):
        try:
            date = self.tipo_cambio_database()

            if date is None:
                self.date = self.get_tipo_cambio_api()
                self.save_tipo_cambio_database(self.date)
            else:
                self.data = {'compra':date[0]}

        except Exception as e:
            raise ValueError(str(e))
    def get_tipo_cambio_api(self):
        try:
            url  = f'https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha={self.fecha.strftime("%Y-%m-%d")}'
            res = requests.get(url)
            if res.status_code == 200:
        
                return res.json()
            else:
                raise ValueError(f'No se encontro un tipo de cambio para la fecha: {self.fecha.strftime("%Y-%m-%d")}')
        except Exception as e:
            raise ValueError(str(e))
    def tipo_cambio_database(self):
        try:
            sql = "SELECT tc_compra FROM t_tcambio WHERE TC_FECHA=?"
            res = self.query(self.document,sql,(self.fecha.strftime('%Y-%m-%d'),),'GET',0)
            return res
        except Exception as e:
            raise Exception(str(e))
    def save_tipo_cambio_database(self,data:dict):
        try:
            sql = "INSERT INTO t_tcambio(tc_fecha,tc_compra,tc_venta,usuario) VALUES (?,?,?,?)"
            params = (self.fecha.strftime("%Y-%m-%d"),data['compra'],data['venta'],self.user_codigo)
            self.query(self.document,sql,params,'POST')
        except Exception as e:
            raise ValueError(str(e))
class GetAuxiliar:
    def __init__(self,document:str,query,query_string):
        self.document = document
        self.query = query
        self.query_string = query_string
        self.razon_social :str = ''
        self.codigo_cliente:str = '' 
        self.get()
    def get(self):
        try:
            sql = "SELECT aux_clave,aux_razon FROM t_auxiliar WHERE aux_docum=?"
            res = self.query(self.document,sql,(self.query_string,),"GET",0)
            self.codigo_cliente = res[0].strip()
            self.razon_social = res[1].strip()
        except Exception as e:
            raise ValueError(str(e))
        
class ListOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs["document"]
            query_string = request.data["query_string"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"SELECT ori_codigo,ori_nombre FROM t_origen WHERE ori_tipo=? AND (ori_nombre LIKE '%{query_string}%' OR ori_codigo LIKE '%{query_string}%') "
            res = self.query(document,sql,(tipo_origen,),"GET",1)
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
class TipoDeCambio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        document = kwargs["document"] 
        try:
       
            instance = TipoCambio(document,request.data["codigo_usuario"],self.query,fecha=datetime.strptime(request.data["fecha"],"%Y-%m-%d"))
            instance.get_tipo_cambio()
            return Response(instance.data,status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
