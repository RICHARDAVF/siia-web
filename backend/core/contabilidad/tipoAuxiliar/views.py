from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase
from datetime import datetime
class ListTipoAuxiliarView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    fecha:datetime = datetime.now()
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']

            sql = "SELECT maa_codigo,maa_nombre,maa_corre,identi FROM t_maesauxi ORDER BY maa_nombre ASC"
            
            res = self.query(document,sql,(),'GET')
            
            data['data'] = [
                {
                    'id':value[-1],
                    'codigo':value[0].strip(),
                    'nombre':value[1].strip(),
                    'correlativo':value[2]
                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})
class SaveTipoAuxiliarView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    fecha:datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo=request.data['codigo']
            nombre=request.data['nombre']
            correlativo=request.data['correlativo']
            usuario=request.data['usuario']

            sql = "SELECT maa_codigo FROM t_maesauxi where maa_codigo=?"
            params=(codigo,)
            result=self.query(document,sql,params,"GET",0)

            if result is not None :
                data['error']='El código ya existe, cámbielo!!!'
                return Response(data)

            sql = """INSERT INTO t_maesauxi (maa_codigo,maa_nombre,maa_corre,usuario,fechausu)
                values(?,?,?,?,?)
            """
            
            params=(codigo,nombre,correlativo,usuario,self.fecha)
            res = self.query(document,sql,params,'POST')
            
            if res==-1:
                data['success']=True
                data['message']='Se guardo con exito'
            else:
                data['error']='No se puedo guardar los datos'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})