from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from config.middleware import TokenAuthentication
from core.conn import DataBase
from datetime import datetime
class ListRecepcionDocumentos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes= [TokenAuthentication]
    fecha : datetime = datetime.now()
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
            sql = f"""SELECT
                            mov_compro,
                            MOV_FECHA,
                            AUX_CLAVE,
                            ART_CODIGO,
                            MOM_CANT,
                            MOM_PUNIT,
                            MOM_VALOR,identi  
                        FROM recep{self.fecha.year}
            """
            params = ()
            res = self.query(document,sql,params,'GET')
            data['data'] = [
                {
                    'id':value[-1],
                    "comprobante":value[0],
                    "fecha":value[1].strftime('%Y-%m-%d'),
                    "codigo_cliente":value[2].strip(),
                    "codigo_articulo":value[3].strip(),
                    "cantidad":value[4],
                    "precio_unitario":value[5],
                    "valor":value[6]

                } for value in res
            ]
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)
