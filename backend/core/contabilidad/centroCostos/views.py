from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase
from datetime import datetime
class ListCentroCostos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']

            sql = "SELECT cco_codigo,cco_nombre,pla_cuenta,cco_aplica,cco_eegg01,cco_incigv,cco_servi,canterior,pre_scta,cco_presup,cco_activo,cco_varios,identi FROM t_ccosto ORDER BY cco_nombre ASC"
            
            res = self.query(document,sql,(),'GET')
            data['data'] = [
                {
                    'id':value[-1],
                    'cco_codigo':value[0].strip(),
                    'cco_nombre':value[1].strip(),
                    'pla_cuenta':value[2].strip(),
                    'cco_aplica':value[3],
                    'cco_eegg01':value[4],
                    'cco_incigv':value[5],
                    'cco_servi':value[6],
                    'canterior':value[7].strip(),
                    'pre_scta':value[8].strip(),
                    'cco_presup':value[9],
                    'cco_activo':value[10],
                    'cco_varios':value[11]
                } for value in res
            ]
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})
class SaveCentroCostos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            data={}
            documento = kwargs["document"]
            cco_codigo=request.data['cco_codigo']
            cco_nombre=request.data['cco_nombre']
            pla_cuenta=request.data['pla_cuenta']
            usuario=request.data['usuario']
            cco_aplica=request.data['cco_aplica']
            cco_eegg01=request.data['cco_eegg01']
            cco_incigv=request.data['cco_incigv']
            cco_servi=request.data['cco_servi']
            canterior=request.data['canterior']
            pre_scta=request.data['pre_scta']
            cco_presup=request.data['cco_presup']
            cco_activo=request.data['cco_activo']
            cco_varios=request.data['cco_varios']
            
            sql = f"""select cco_codigo from t_ccosto where cco_codigo=?"""
            params=(cco_codigo,)
            result=self.query(documento,sql,params,"GET",0)
            
            if result is not None :
                data['error']='El código ya existe, cámbielo!!!'
                return Response(data)
            
            sql = f"""INSERT INTO t_ccosto (cco_codigo,cco_nombre,pla_cuenta,usuario,fechausu,cco_aplica,cco_eegg01,cco_incigv,cco_servi,canterior,pre_scta,cco_presup,cco_activo,cco_varios)
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """
            
            params=(cco_codigo,cco_nombre,pla_cuenta,usuario,self.fecha,cco_aplica,cco_eegg01,cco_incigv,cco_servi,canterior,pre_scta,cco_presup,cco_activo,cco_varios)
            res=self.query(documento,sql,params,"POST")
            
            if res==-1:
                data['success']=True
                data['message']='Se guardo con exito'
            else:
                data['error']='No se puedo guardar los datos'
            return Response(data)
        except Exception as e:
            return Response({"error":f"Ocurrio un error al guardar la data:{str(e)}"})
class DeleteCentroCostos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data={}
            documento = kwargs["document"]
            codigo = request.data["cco_codigo"]
            
            sql = f"""delete from t_ccosto where cco_codigo=?"""
            
            params=(codigo,)
            res=self.query(documento,sql,params,"POST")
            
            if res==-1:
                data['success']=True
                data['message']='Se eliminó con exito'
                
            return Response(data)
        except Exception as e:
            return Response({"error":f"Ocurrio un error al eliminar la data:{str(e)}"})
class EditCentroCostos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            data={}
            documento = kwargs["document"]
            cco_codigo=request.data['cco_codigo']
            cco_nombre=request.data['cco_nombre']
            pla_cuenta=request.data['pla_cuenta']
            usuario=request.data['usuario']
            cco_aplica=request.data['cco_aplica']
            cco_eegg01=request.data['cco_eegg01']
            cco_incigv=request.data['cco_incigv']
            cco_servi=request.data['cco_servi']
            canterior=request.data['canterior']
            pre_scta=request.data['pre_scta']
            cco_presup=request.data['cco_presup']
            cco_activo=request.data['cco_activo']
            cco_varios=request.data['cco_varios']
            
            sql = "UPDATE t_ccosto SET cco_nombre=?,pla_cuenta=?,usuario=?,fechausu=?,cco_aplica=?,cco_eegg01=?,cco_incigv=?,cco_servi=?,canterior=?,pre_scta=?,cco_presup=?,cco_activo=?,cco_varios=? WHERE cco_codigo=?"
            
            params=(cco_nombre,pla_cuenta,usuario,self.fecha,cco_aplica,cco_eegg01,cco_incigv,cco_servi,canterior,pre_scta,cco_presup,cco_activo,cco_varios,cco_codigo)
            res=self.query(documento,sql,params,"POST")
            
            if res==-1:
                data['success']=True
                data['message']='Se editó con exito'
                
            return Response(data)
        except Exception as e:
            return Response({"error":f"Ocurrio un error al editar la data:{str(e)}"})
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            codigo = kwargs['codigo']

            sql = "SELECT cco_codigo,cco_nombre,pla_cuenta,cco_aplica,cco_eegg01,cco_incigv,cco_servi,canterior,pre_scta,cco_presup,cco_activo,cco_varios,identi FROM t_ccosto where cco_codigo=?"
            params=(codigo,)
            
            res = self.query(document,sql,params,'GET',0)
            
            data['data'] = {
                    'id':res[-1],
                    'cco_codigo':res[0].strip(),
                    'cco_nombre':res[1].strip(),
                    'pla_cuenta':res[2].strip(),
                    'cco_aplica':res[3],
                    'cco_eegg01':res[4],
                    'cco_incigv':res[5],
                    'cco_servi':res[6],
                    'canterior':res[7].strip(),
                    'pre_scta':res[8].strip(),
                    'cco_presup':res[9],
                    'cco_activo':res[10],
                    'cco_varios':res[11]
                }
            data['success'] = True
            return Response(data)
        except Exception as e:
            return Response({'error':f'Ocurrio un error:{str(e)}'})