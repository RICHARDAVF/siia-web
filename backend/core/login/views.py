import requests
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from core.conn import DataBase
from datetime import datetime
# Create your views here.
class TipoCambio:
    def __init__(self,document:str,user_codigo:str,query):
        self.query = query
        self.document:str  = document
        self.user_codigo:str = user_codigo
        self.fecha:datetime = datetime.now()
        self.data:dict = {}
    def get_tipo_cambio(self):
        try:
            date = self.tipo_cambio_database()
     
            if date is None:
                self.date = self.get_tipo_cambio_api()
                self.save_tipo_cambio_database(self.date)
            else:
                self.data = {'compra':date[0]}
        except Exception as e:
            raise ValueError(str(e))
    def get_tipo_cambio_api(self):
        try:
            url  = f'https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha={self.fecha.strftime("%Y-%m-%d")}'
            res = requests.get(url)
            if res.status_code == 200:
        
                return res.json()
            else:
                raise ValueError(f'No se encontro un tipo de cambio para la fecha: {self.fecha.strftime("%Y-%m-%d")}')
        except Exception as e:
            raise ValueError(str(e))
    def tipo_cambio_database(self):
        try:
            sql = "SELECT tc_compra FROM t_tcambio WHERE TC_FECHA=?"
            res = self.query(self.document,sql,(self.fecha.strftime('%Y-%m-%d'),),'GET',0)
            return res
        except Exception as e:
            raise Exception(str(e))
    def save_tipo_cambio_database(self,data:dict):
        try:
            sql = "INSERT INTO t_tcambio(tc_fecha,tc_compra,tc_venta,usuario) VALUES (?,?,?,?)"
            params = (self.fecha.strftime("%Y-%m-%d"),data['compra'],data['venta'],self.user_codigo)
            self.query(self.document,sql,params,'POST')
        except Exception as e:
            raise ValueError(str(e))

class LoginUser(GenericAPIView,DataBase):
    authentication_classes =[]
    permission_classes = []
    def post(self,request,*args,**kwargs):
        document = kwargs["document"]
        try:
            datos = request.data
            sql = "SELECT usu_abrev,usu_codigo,ven_codigo FROM t_usuario WHERE usu_abrev=? AND usu_login=?"
            params = (datos["username"],self.hash_password(datos["password"]))
            token = self.token(document)
            res = self.query(document,sql,params,'GET',0)
            if res is None:
                raise ValueError("Documento, usuario o Contraseña incorrecta")
            user = {
                "username":res[0].strip(),
                "codigo_usuario":res[1].strip(),
                "codigo_vendedor":res[2].strip(),
                "token":token,
                "document":document,
            }

            instance = TipoCambio(document,res[-1],self.query)
            instance.get_tipo_cambio()
            user['tipo_cambio'] = instance.data['compra']
            return Response(user,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def hash_password(self,password):
        return ''.join(chr(int(i)) for i in  [ str(ord(i)+8) for i in (password+'*'*(8-len(password))).upper()])
