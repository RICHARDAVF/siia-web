from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase

class ListTipoServicio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            sql = """
                SELECT tse_codigo,tse_nombre,tse_porcen,c51_codigo,tse_adicio,identi FROM t_tip_serv
            """
            res = self.query(document,sql,(),'GET',1)
            data['data'] = [
                {
                    'id':value[-1],
                    'codigo':value[0].strip(),
                    "nombre":value[1].strip(),
                    'porcentaje':value[2]
                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error: {str(e)}'})
class SaveTipoServicio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            if self.validarCodigo():
                raise ValueError('Ya existe un servicio con ese codigo')
            document = kwargs['document']
            datos = request.data
            params = (datos['codigo'],datos['nombre'],datos['porcentaje'],datos['c51_tipo_operacion'],datos['codigo_adicional'])
            sql = f"""
                INSERT INTO t_tip_serv(tse_codigo,tse_nombre,tse_porcen,c51_codigo,tse_adicio) VALUES ({','.join('?' for i in params)})
            """
            res = self.query(document,sql,params,'POST',)
            if res==-1:
                data['success'] = True
                data['message'] = 'Los datos se guardaron de manera correcta'
            else:
                data['error'] = 'Ocurrio un error al crear el servicio'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error: {str(e)}'})
    def validarCodigo(self):
        try:
            sql = "SELECT tse_codigo FROM t_tip_serv WHERE tse_codigo=?"
            params = (self.request.data['codigo'],)
            res = self.query(self.kwargs['document'],sql,params,'GET',0)
            return res is not None
        except Exception as e:
            raise ValueError('Ocurrio un error la validar el codigo')
class EditTipoServicio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document =kwargs['document']
            codigo = kwargs['codigo']
            sql = """SELECT tse_codigo,tse_nombre,tse_porcen,c51_codigo,tse_adicio FROM t_tip_serv WHERE tse_codigo=?"""
            res = self.query(document,sql,(codigo,),'GET',0)
            data['data'] = {
                'codigo':res[0].strip(),
                'nombre':res[1].strip(),
                "porcentaje":res[2],
                "c51_tipo_operacion":res[3],
                'codigo_adicional':res[3],
            }
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error: {str(e)}'})
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            datos = request.data
            document = kwargs['document']
            sql = f"""
                UPDATE t_tip_serv SET tse_nombre=?,tse_porcen=?,c51_codigo=?,
                tse_adicio=? WHERE tse_codigo=?
            """
            params = (datos['nombre'],datos['porcentaje'],datos['c51_tipo_operacion'],datos['codigo_adicional'],datos['codigo'])
            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['success'] = True
                data['message'] = 'Los datos se editaron de manera correcta'
            else:
                data['error'] = 'Ocurrio un error al editar el servicio'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error {str(e)}'})
class DeleteTipoServicio(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = request.data['codigo']
            sql = "DELETE FROM t_tip_serv WHERE tse_codigo=?"
            params = (codigo,)
            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['success'] = True
                data['message'] = 'El servicio se elimino de manera correcta'
            else:
                data['error'] = 'Ocurrio un error al eliminar el servicio'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error {str(e)}'})