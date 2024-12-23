
from django.shortcuts import render

import requests

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from core.views import TipoCambio
from core.conn import DataBase

# Create your views here.

from datetime import datetime

# Create your views here.

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
