from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.conn import DataBase
from config.middleware import TokenAuthentication
from datetime import datetime
class EditAsientos(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes  = [TokenAuthentication]
    fecha : datetime = datetime.now()
    def get(self,request,*args,**kwargs):
        try:
            data = {}
            document = kwargs['document']
    
            comprobante,mes,origen = kwargs['query_string'].split('-')

            sql = f"""SELECT 
	                    MOV_FECHAC,mov_femisi,mov_tipoas,ORI_CODIGO,mov_diapag,UBI_CODIGO,MOV_GLOSA,PLA_CUENTA,AUX_CLAVE,ven_codigo,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_MONED,MOV_H,MOV_D,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,MOV_FVENC
                        FROM MOVA{self.fecha.year} 
                    WHERE ORI_CODIGO=? AND MOV_MES=? AND MOV_COMPRO=? ORDER BY pla_cuenta asc  """
            
            params = (origen,mes,comprobante)
            result = self.query(document,sql,params,'GET')
            res = result[0]
            form_header =  {
                'fecha_contable':res[0].strftime('%Y-%m-%d'),
                'fecha_emision':res[1].strftime('%Y-%m-%d'),
                'tipo_asiento':res[2],
                'origen':res[3].strip(),
                'dias':res[4],
                'ubicacion':res[5].strip(),
                'observacion':res[6],
            }
            list_table =  [
                {
                    'id':index,
                    'cuenta':value[7].strip(),
                    'cliente':value[8].strip(),
                    'vendedor':value[9].strip(),
                    'tipo_document':value[10].strip(),
                    'serie':value[11].strip(),
                    'numero':value[12],
                    'moneda':value[13].strip(),
                    'haber_soles':value[14],
                    'debe_soles':value[15],
                    'haber_dolares':value[16],
                    'debe_dolares':value[17],
                    'tipo_cambio':value[18],
                    'observacion':value[19].strip(),
                    'fecha_vencimiento':value[20].strftime('%Y-%m-%d'),

                } for index,value in enumerate(result)
            ]
            data['success'] = True
            data['data'] = {
                'form_header':form_header,
                'list_table':list_table
            }
            return Response(data)
        except Exception as e:
    
            return Response({'error':f'Ocurrio un error : {str(e)}'})