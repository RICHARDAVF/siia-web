from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from core.conn import DataBase
from config.middleware import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework import status

# Create your views here.
class ListOrigen(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            documnet = kwargs["document"]
            query_string = request.data["query_string"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"SELECT ori_codigo,ori_nombre FROM t_origen WHERE ori_tipo=? LIKE ori_nombre '%{query_string}%' OR ori_codigo LIKE '%{query_string}%' "
            res = self.query(documnet,sql,(tipo_origen,),"GET",1)
            data = [
                {
                    "id":index,
                    "value":value[0].strip(),
                    "label":value[1].strip()
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error: {str(e)}"},status=status.HTTP_400_BAD_REQUEST)