from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from config.middleware import TokenAuthentication
from core.conn import DataBase
from rest_framework.permissions import AllowAny

class CondicionPagoList(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwars):
        data = {}
        try:
            document = kwars['document']
            sql = f"""
                    SELECT 
                        PAG_CODIGO,
                        pag_nombre,
                        pag_activo,
                        pag_tippag,
                        pag_canlet,
                        pag_dias,
                        pag_dias2,
                        pag_dias3,
                        pag_dias4,
                        pag_dias5,
                        pag_dias6,
                        pag_dias7,
                        pag_dias8,
                        pag_dias9,
                        pag_dias10,
                        identi 
                    FROM t_maepago
                    """
            states = {'1':"ACTIVO","0":"NO ACTIVO"}
            res = self.query(document,sql,(),'GET',1)
            data['data'] = [
                {
                    'id':value[-1],
                    "codigo":value[0].strip(),
                    "nombre":value[1].strip(),
                    "estado":states[f"{value[2]}"],
                    "status":value[2],
                    "tipo":value[3].strip(),
                    'cantidad_letras':value[4],
                    'dias':self.get_number_dias(value[5:-2])

                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f"Ocurrio un error : {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def get_number_dias(self,data):

        return [i for i in data if i!=0]
class EditCondicionPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        data = {}
        try:
            document = kwargs['document']
            codigo = kwargs['codigo']
            sql = f"""SELECT  
                        pag_canlet,pag_dias,pag_dias2,pag_dias3,pag_dias4,pag_dias5,pag_dias6,pag_dias7,pag_dias8,pag_dias9,pag_dias10,pag_tippag,pag_tipdoc,pag_conven,pag_nvallc,pag_tienda,pag_apraut,pag_titgra,pag_activo,pag_dscto1,pag_dscuni,pag_adelan,pag_agrcon,pag_reccom,pag_estado,t01_codigo
                    FROM t_maepago WHERE pag_codigo=?
                        """
            res = self.query(document,sql,(codigo,),'GET',0)
            
            data['data'] = {
                'cantidad_letras':res[0],
                'dia1':res[1],
                'dia2':res[2],
                'dia3':res[3],
                'dia4':res[4],
                'dia5':res[5],
                'dia6':res[6],
                'dia7':res[7],
                'dia8':res[8],
                'dia9':res[9],
                'dia10':res[10],
                'tipo_pago':res[11].strip(),
                'tipo_documento':res[12].strip(),
                'no_considera_ventas':res[13]==1,
                'visualizar_tienda':res[14]==1,
                "no_valida_credito":res[15]==1,
                'aprobacion_automatica':res[16]==1,
                'titulo_gratuito':res[17]==1,
                'activo':res[18]==1,
                'descuento':res[19],
                'descuento_unico':res[20]==1,
                'adelanto':res[21]==1,
                'agrupa_credito':res[22]==1,
                'recojo_compras':res[23]==1,
                'estado':res[24],
                'tabla':res[25]
            }

            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error: {str(e)}'})
    def post(self,request,*args,**kwargs):
        data = {}
        try:
            
            document = kwargs['document']
            datos = request.data

            params = (datos['nombre'],datos['cantidad_letras'],datos['dia1'],datos['dia2'],datos['dia3'],datos['dia4'],datos['dia5'],datos['dia6'],datos['dia7'],datos['dia8'],datos['dia9'],datos['dia10'],datos['tipo_pago'],datos['tipo_documento'],datos['no_considera_ventas'],datos['no_valida_credito'],datos['visualizar_tienda'],datos['aprobacion_automatica'],datos['titulo_gratuito'],datos['activo'],datos['descuento'],datos['descuento_unico'],datos['adelanto'],datos['agrupa_credito'],datos['recojo_compras'],datos['estado'],datos['tabla'],datos['codigo'])
            sql = f"""UPDATE  t_maepago  SET pag_nombre=?,pag_canlet=?,pag_dias=?,pag_dias2=?,pag_dias3=?,pag_dias4=?,pag_dias5=?,pag_dias6=?,pag_dias7=?,pag_dias8=?,pag_dias9=?,pag_dias10=?,pag_tippag=?,pag_tipdoc=?,pag_conven=?,pag_nvallc=?,pag_tienda=?,pag_apraut=?,pag_titgra=?,pag_activo=?,pag_dscto1=?,pag_dscuni=?,pag_adelan=?,pag_agrcon=?,pag_reccom=?,pag_estado=?,t01_codigo=?  WHERE pag_codigo=?"""

            result = self.query(document,sql,params,'POST')
            if result==-1:
                data['success'] = True
                data['message'] = 'Los datos se editaron exitosamente'
            else:
                data['error'] = 'Ocurrio un error al editar los datos'
            return Response(data)
        except Exception as e:
            return Response({'error':f"Ocurrio un error: {str(e)}"})
class SaveCondicionPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,requests,*args,**kwargs):
        data = {}
        try:
            document = kwargs['document']
            if self.validarCodigo():
                raise ValueError('Ya existe una condicion de pago con ese codigo')
            datos = requests.data
            params = (datos['codigo'],datos['nombre'],datos['cantidad_letras'],datos['dia1'],datos['dia2'],datos['dia3'],datos['dia4'],datos['dia5'],datos['dia6'],datos['dia7'],datos['dia8'],datos['dia9'],datos['dia10'],datos['tipo_pago'],datos['tipo_documento'],datos['no_considera_ventas'],datos['no_valida_credito'],datos['visualizar_tienda'],datos['aprobacion_automatica'],datos['titulo_gratuito'],datos['activo'],datos['descuento'],datos['descuento_unico'],datos['adelanto'],datos['agrupa_credito'],datos['recojo_compras'],datos['estado'],datos['tabla'])
            sql = f"""INSERT INTO  t_maepago(pag_codigo,pag_nombre,pag_canlet,pag_dias,pag_dias2,pag_dias3,pag_dias4,pag_dias5,pag_dias6,pag_dias7,pag_dias8,pag_dias9,pag_dias10,pag_tippag,pag_tipdoc,pag_conven,pag_nvallc,pag_tienda,pag_apraut,pag_titgra,pag_activo,pag_dscto1,pag_dscuni,pag_adelan,pag_agrcon,pag_reccom,pag_estado,t01_codigo) VALUES({','.join('?' for i in params)})"""
            
            res = self.query(document,sql,params,'POST')
            print(res)
            if res==-1:
                data['success'] = True
                data['message'] = 'La condicion de pago se creo exitosamente'
            else:
                data['error'] = 'Ocurrio un error al crear la condicion de pago'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})
    def validarCodigo(self):
        try:
            sql = "SELECT PAG_CODIGO FROM t_maepago WHERE pag_codigo=?"
            params = (self.request.data['codigo'],)
            res = self.query(self.kwargs['document'],sql,params,'GET',0)
            return res is not None
        except Exception as e:
            raise ValueError('Ocurrio un error la validar el codigo')
class DeleteCondicionPago(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        data = {}
        try:
            document = kwargs['document']
            codigo = request.data['codigo']

            sql = "DELETE FROM t_maepago WHERE pag_codigo=?"
            params = (codigo,)
            res = self.query(document,sql,params,'POST')
            if res==-1:
                data['success'] = True
                data['message'] = 'La condicion de pago se elimino exitosamente'
            else:
                data['error'] = 'Ocurrio un error al eliminar la condicion de pago'
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error: {str(e)}'})
