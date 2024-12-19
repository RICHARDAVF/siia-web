from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase

class ListMedioPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            sql = f"""SELECT med_codigo,med_nombre,pla_cuecaj,med_grupo,identi FROM t_maemedio"""
            res = self.query(document,sql,(),'GET')
            data['data'] = [
                {
                    'id':value[-1],
                    "codigo":value[0].strip(),
                    'nombre':value[1].strip(),
                    "cuenta":value[2].strip(),
                    "grupo":value[3]
                } for value in res
            ]
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error :{str(e)}'})
        
class SaveMedioPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            datos = request.data
            params  = (datos['codigo'],datos['nombre'],datos['tabla'],datos['cuenta'],datos['grupo']) 
            sql = f"""INSERT INTO t_maemedio(med_codigo,med_nombre,t01_codigo,pla_cuecaj,med_grupo) VALUES(?,?,?,?,?)"""
            res = self.query(document,sql,params,'POST')
            if res == -1:
                data['success'] = True
                data['message'] = 'El medio de pago se realizo con exito'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error :{str(e)}'})
class EditMedioPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            sql = f"""SELECT med_codigo,med_nombre,t01_codigo,pla_cuecaj,med_grupo  FROM t_maemedio WHERE med_codigo=?""" 
            params = (kwargs['codigo'])
            res = self.query(document,sql,params,'GET',0)
            data ['data'] = {
                'codigo':res[0].strip(),
                'nombre':res[1].strip(),
                'tabla':res[2].strip(),
                'cuenta':res[3].strip(),
                'grupo':res[4]
            }
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = kwargs['codigo']
            datos = request.data
            params  = (datos['nombre'],datos['tabla'],datos['cuenta'],datos['grupo'],codigo)
            sql = f"""
                UPDATE t_maemedio
                    SET med_nombre=?,
                    t01_codigo=?,
                    pla_cuecaj=?,
                    med_grupo=? WHERE med_codigo=?

            """
            res = self.query(document,sql,params,'POST')
            if res == -1:
                data['success'] = True
                data['message'] = 'El medio de pago se actualizo con exito'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error :{str(e)} '})
        
class DeleteMedioPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = request.data['codigo']
            if codigo != kwargs['codigo']:
                raise ValueError('Violacion de datos')
            params = (codigo,)
            sql = f"DELETE FROM t_maemedio WHERE med_codigo=?"
            res = self.query(document,sql,params,'POST')
            if res == -1:
                data['success'] = True
                data['message'] = 'El medio de pago se elimino con exito'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})