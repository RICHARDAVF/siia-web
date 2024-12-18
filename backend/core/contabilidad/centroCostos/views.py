from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase
class ListCentroCostos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']

            sql = "SELECT cco_codigo,cco_nombre,identi FROM t_ccosto ORDER BY cco_nombre ASC"
            res = self.query(document,sql,(),'GET')
            data['data'] = [
                {
                    'id':value[-1],
                    'codigo':value[0].strip(),
                    'nombre':value[1].strip()
                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})