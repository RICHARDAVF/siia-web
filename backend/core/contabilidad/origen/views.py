from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase
class Listorigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']

            sql = f"""
                SELECT ori_codigo,ori_nombre,ori_tipo,ori_ventas,ori_rechon,identi FROM t_origen ORDER BY ori_nombre ASC

"""
            tipo_origen = {'1':'COMPRAS','2':'CAJA','3':'CONTABILIDAD','4':'RETENCION','5':'RETENCION(clientes)'}
            res = self.query(document,sql,(),'GET')
            data['data'] = [
                {
                    'id':value[-1],
                    'codigo':value[0].strip(),
                    'nombre':value[1].strip(),
                    'tipo':value[2],
                    'tipo_origen':tipo_origen[str(value[2])],
                    'ventas':value[3],
                    'recibos_honorarios':value[4],
                    'origen':self.get_origen(value[3],value[4])
                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})
    def get_origen(self,value1,value2):
        if int(value1)==1 and int(value2)==1:
            return 'VENTAS/R.H'
        elif int(value1)==1:
            return 'VENTAS'
        elif int(value2)==1:
            return 'R.H'
        else:
            return 'S/N'
class SaveOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            if self.validarCodigo():
                raise ValueError('Ya existe un origen con ese codigo')
            datos = request.data
            document = kwargs['document']
            ventas = 1 if datos['ventas'] else 0
            recibo_honorarios = 1 if datos['recibo_honorarios'] else 0
            params = (datos['codigo'],datos['nombre'],datos['tipo_origen'],datos['libro'],datos['cuenta'],ventas,recibo_honorarios,datos['tipo_caja'],datos['correlativo'])

            sql = f"""INSERT INTO t_origen(ori_codigo,ori_nombre,ori_tipo,lib_codigo,pla_cuenta,ori_ventas,ori_rechon,ori_tipcaj,ori_corre) VALUES({','.join('?' for i in params)}) """

            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['message'] = 'Los datos se guardaron exitosamente'
                data['success'] = True
            else:
                data['error'] = 'Ocurrio un error al registrar el origen'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            
            return Response({'error':f'Ocurrio un error :{str(e)}'})
    def validarCodigo(self):
        try:
            document = self.kwargs['document']
            codigo = self.request.data['codigo']
            sql = f"SELECT ori_codigo FROM t_origen WHERE ori_codigo=?"
            params = (codigo,)
            res = self.query(document,sql,params,'GET',0)
            return res is not None
        except Exception as e:
            raise ValueError('No se puedo validar el codigo de origen')
class DeleteOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = request.data['codigo']
            sql = f"DELETE FROM t_origen WHERE ori_codigo=?"
            params = (codigo,)
            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['success'] = True
                data['message'] = 'El origen fue eliminado exitosamente'
            else:
                data['error'] = 'Ocurrio un error al eliminar el origen'
            return Response(data,status=status.HTTP_200_OK)
        except  Exception as e:
            return Response({'error':f'Ocurrio un error :{str(e)}'})
class EditOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = kwargs['codigo']
            sql = 'SELECT ori_codigo,ori_nombre,ori_tipo,lib_codigo,pla_cuenta,ori_ventas,ori_rechon,ori_tipcaj,ori_corre FROM t_origen WHERE ori_codigo=?'
            params = (codigo,)
            res = self.query(document,sql,params,'GET',0)
            data['data'] = {
                'codigo':res[0].strip(),
                'nombre':res[1].strip(),
                'tipo_origen':res[2],
                'libro':res[3],
                'cuenta':res[4].strip(),
                'ventas':res[5],
                'recibo_honorarios':res[6],
                'correlativo':res[7]
            }
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs['document']
            data = {}
            codigo = kwargs['codigo']
            datos = request.data
            ventas = 1 if datos['ventas'] else 0
            recibo_honorarios = 1 if datos['recibo_honorarios'] else 0
            sql = f"""UPDATE  t_origen SET ori_nombre=?,ori_tipo=?,lib_codigo=?,pla_cuenta=?,ori_ventas=?,ori_rechon=?,ori_tipcaj=?,ori_corre=? WHERE ori_codigo=?"""
            params = (datos['nombre'],datos['tipo_origen'],datos['libro'],datos['cuenta'],ventas,recibo_honorarios,datos['tipo_caja'],datos['correlativo'],codigo)
            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['success'] = True
                data['message'] = 'El origen fue editado exitosamente'
            else:
                data['error'] = 'Ocurrio un error al editar el origen'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})