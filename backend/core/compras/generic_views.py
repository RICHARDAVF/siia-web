from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from core.conn import DataBase
from config.middleware import TokenAuthentication
from rest_framework.permissions import AllowAny
from typing import Callable
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
                    "value":f"{value[0].strip()}",
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
class GenericViews(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs["document"]
            query_string = request.data["query_string"]
            tipo_origen = request.data["tipo_origen"]
            origen = Origen(document,tipo_origen,query_string,self.query)
            data["origen"] = origen.get()
            ubicacion = Ubicacion(document,self.query)
            data["ubicacion"] = ubicacion.get()
            tipo_documento = TipoDocumento(document,self.query)
            data["tipo_documento"] = tipo_documento.get()
            centro_costo = CentroCostos(document,self.query)
            data["centro_costo"] = centro_costo.get()
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"})