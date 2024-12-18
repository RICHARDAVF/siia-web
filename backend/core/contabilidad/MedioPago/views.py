from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase

class ListMedioPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            sql = f"""SELECT med_codigo,med_nombre,pla_cuecaj,med_grupo,identi FROM t_maemedio"""
            res = self.query(document,sql,(),'GET')
            
        except Exception as e:
            return Response({'error':f'Ocurrio un error :{str(e)}'})