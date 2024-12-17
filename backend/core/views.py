from typing import Callable
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
    def __init__(self,document:str,user_codigo:str,query,fecha:datetime = None ):
        self.query = query
        self.document:str  = document
        self.user_codigo:str = user_codigo
        self.fecha:datetime = fecha 
        if self.fecha is None:
            self.fecha = datetime.now()
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
class GetVendedor:
    def __init__(self,document:str,query:Callable):
        self.document = document
        self.query = query   
    def get(self):
        try:
            sql =f"""
                    SELECT ven_codigo,ven_nombre FROM t_vendedor
"""
            res = self.query(self.document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return data
        except Exception as e:
            raise ValueError(str(e)) 
class Origen:
    def __init__(self,document:str,tipo_origen:str,query_string:str,query:Callable):
        self.document = document
       
        self.query = query
        self.query_string = query_string
        self.tipo_origen = tipo_origen
    def get(self):
        try:
            sql = f"SELECT ori_codigo,ori_nombre FROM t_origen WHERE ori_tipo=? AND (ori_nombre LIKE '%{self.query_string}%' OR ori_codigo LIKE '%{self.query_string}%') "
            res = self.query(self.document,sql,(self.tipo_origen,),"GET",1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return data
        except Exception as e:
            raise ValueError(str(e))
class Ubicacion:
    def __init__(self,document:str,query:Callable):
        self.document = document
        self.query = query
    def get(self):
        try:
            sql = "SELECT ubi_codigo,ubi_nombre FROM t_ubicacion"
            res = self.query(self.document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return data
        except Exception as e:
            raise ValueError(str(e))       
class TipoDocumento:
    def __init__(self,document:str,query:Callable):
        self.document = document
        self.query = query
    def get(self):
        try:
            sql = f"""
                SELECT 
                    DOC_CODIGO,
                    DOC_NOMBRE,
                    DOC_SERIE 
                FROM t_documento 
                WHERE   
                    elimini=0
                   
            """
            res = self.query(self.document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":f"{value[0].strip()}-{value[2].strip()}",
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return data
        except Exception as e:
            raise ValueError(str(e))
class CentroCostos:
    def __init__(self,document:str,query:Callable):
        self.document = document 
        self.query = query 
    def get(self):
        try:
            sql = "SELECT cco_codigo,cco_nombre,pla_cuenta FROM t_ccosto"
            res = self.query(self.document,sql,(),'GET',1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return data
        except Exception as e:
            raise ValueError(str(e))
class GetTipoAsiento:
    def __init__(self,document,query):
        self.document = document
        self.query = query
    def get(self):
        try:
            sql = f"""
            SELECT tpa_codigo,tpa_nombre FROM t_tipoasie

"""
            res = self.query(self.document,sql,(),"GET",1)
      
            data = [
                {
                    "id":index,
                    "value":int(value[0]),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            
            return data
        except Exception as e:
            print(str(e))
            raise ValueError(str(e))
class GetTablas:
    def __init__(self,document,query_string,query):
        self.document = document
        self.query_string = query_string
        self.query = query
    def get(self):
        try:
            sql = f"""
                SELECT t01_codigo,t01_nombre FROM t_tabla1 WHERE t01_codigo LIKE '%{self.query_string}%' OR t01_nombre LIKE '%{self.query_string}%'
        """
           
            
            result = self.query(self.document,sql,(),'GET',1)
            data = [
                {
                    'id':f"{index}-{value[0].strip()}",
                    'value':value[0].strip(),
                    'label':value[1].strip()
                } for index,value in enumerate(result)
            ]
  
            return data
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

            sql = f"SELECT ori_codigo,ori_nombre FROM t_origen WHERE ori_tipo=? LIKE ori_nombre '%{query_string}%' OR ori_codigo LIKE '%{query_string}%' "

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
            if 'action' in request.data and request.data['action']=='cuenta10':
                sql = f"""
                    SELECT
                        pla_cuenta,
                        pla_nombre,
                        pla_moneda

                    FROM PLAN{self.fecha.year}
                        WHERE SUBSTRING(pla_cuenta,1,2)='10'
                """
            res = self.query(document,sql,(),'GET',1)
       
            data = [
                {
                    'id':f"{index}-{value[-1].strip()}",
                    'value':value[0].strip(),
                    'label':value[1].strip(),
                    'moneda':value[2].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
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
class VendedorView(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            instance = GetVendedor(document,self.query)
            data = instance.get()
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)


class GenericViews(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs["document"]
            query_string = request.data["query_string"]
            tipo_origen = request.data["tipo_origen"]
            if "origen" in request.data['dates']:
                origen = Origen(document,tipo_origen,query_string,self.query)
                data["origen"] = origen.get()
            if 'ubicacion' in request.data['dates']:
                ubicacion = Ubicacion(document,self.query)
                data["ubicacion"] = ubicacion.get()
            if "tipo-documento" in request.data['dates']:
                tipo_documento = TipoDocumento(document,self.query)
                data["tipo_documento"] = tipo_documento.get()
            if 'centro-costos' in request.data['dates']:
                centro_costo = CentroCostos(document,self.query)
                data["centro_costo"] = centro_costo.get()
            if 'vendedor' in request.data['dates']:
                instance = GetVendedor(document,self.query)
                data['vendedor'] = instance.get()
            if "tipo-asiento" in request.data["dates"]:
                instance = GetTipoAsiento(document,self.query)
                data["tipo_asiento"] = instance.get()
            if 'tablas' in request.data['dates']:
                instance = GetTablas(document,query_string,self.query)
                data['tablas'] = instance.get()
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
     
            return Response({"error":f"Ocurrio un error:{str(e)}"})
