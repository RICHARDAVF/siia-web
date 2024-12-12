<<<<<<< HEAD

=======
<<<<<<< HEAD
from django.shortcuts import render
=======
import requests
>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
>>>>>>> 462e34c56237d8935239d4ffb58c7ecacefada26
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from core.views import TipoCambio
from core.conn import DataBase
<<<<<<< HEAD

=======
<<<<<<< HEAD
# Create your views here.
=======
from datetime import datetime
>>>>>>> 462e34c56237d8935239d4ffb58c7ecacefada26
# Create your views here.

>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
class LoginUser(GenericAPIView,DataBase):
    authentication_classes =[]
    permission_classes = []
    def post(self,request,*args,**kwargs):
        document = kwargs["document"]
        try:
            datos = request.data
<<<<<<< HEAD
            sql = "SELECT usu_abrev FROM t_usuario WHERE usu_abrev=? AND usu_login=?"
=======
            sql = "SELECT usu_abrev,usu_codigo,ven_codigo FROM t_usuario WHERE usu_abrev=? AND usu_login=?"
>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
            params = (datos["username"],self.hash_password(datos["password"]))
            token = self.token(document)
            res = self.query(document,sql,params,'GET',0)
            if res is None:
                raise ValueError("Documento, usuario o Contraseña incorrecta")
            user = {
                "username":res[0].strip(),
<<<<<<< HEAD
                "token":token,
                "document":document
            }
=======
                "codigo_usuario":res[1].strip(),
                "codigo_vendedor":res[2].strip(),
                "token":token,
                "document":document,
            }

            instance = TipoCambio(document,res[-1],self.query)
            instance.get_tipo_cambio()
            user['tipo_cambio'] = instance.data['compra']
>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
            return Response(user,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def hash_password(self,password):
<<<<<<< HEAD
        return ''.join(chr(int(i)) for i in  [ str(ord(i)+8) for i in (password+'*'*(8-len(password))).upper()])
=======
        return ''.join(chr(int(i)) for i in  [ str(ord(i)+8) for i in (password+'*'*(8-len(password))).upper()])
>>>>>>> 1cb272c945efe937f26e0e9ac473a96cbaf6a71f
