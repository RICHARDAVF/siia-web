from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from config.middleware import TokenAuthentication
from core.conn import DataBase
class ListCuentasView(GenericAPIView,DataBase):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    def post(self,request,*args,**kwargs):
        return Response({"success":"todo"},status=status.HTTP_200_OK)