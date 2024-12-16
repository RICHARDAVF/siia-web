from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.conn import DataBase
from config.middleware import TokenAuthentication
from datetime import datetime
class EditAsientos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes  = [TokenAuthentication]
    fecha : datetime = datetime.now()
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
    
            comprobante,mes,origen = kwargs['query_string'].split('-')

            sql = f"""SELECT*FROM MOVA{self.fecha.year} WHERE mov_mes=? AND mov_compro=? AND ori_codigo=?"""
            
            params = (mes,comprobante,origen)
            res = self.query(document,sql,params,'GET')
            data['form_header'] = {
                ''
            }
            return Response({'data':'datos recuperado','success':True})
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})