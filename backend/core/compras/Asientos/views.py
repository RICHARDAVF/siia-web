from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from core.views import GetAuxiliar
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
    def post(self,request,*args,**kwargs):
        try:
            pass
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})
    def post(self,request,*args,**kwargs):
        try:
            if not self.delete_registers():
                raise ValueError('No se pudo editar los items')
            document = kwargs['document']
            datos = request.data
            comprobante,mes,origen = kwargs['query_string'].split('-')
            sql = f"""
                    INSERT INTO MOVA{self.fecha.year}(
             alm_codigo,mov_mes,ORI_CODIGO,UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,aux_clave,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas,mov_total,mov_femisi,mov_moned,mov_fvenc,mov_diapag
                    ) VALUES
"""
            for item in request.data['items']:
                tipo_documento = item['tipo_documento'].split('-')[0]
                auxiliar = GetAuxiliar(document,self.query,item['auxiliar'])
                suma_total = self.suma_total()
                params = ("53",mes,origen,datos['ubicacion'],comprobante,self.fecha.strftime("%Y-%m-%d"),item['glosa'],item['cuenta'],auxiliar.codigo_cliente,tipo_documento,item['serie'],item['numero'],item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],item['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],item['vendedor'],datos['tipo_asiento'],suma_total,datos["fecha_emision"],item["moneda"],item["fecha_vencimiento"],datos["dias"])
                sql1 = sql+f"({','.join('?' for i in params)})"
                self.query(document,sql1,params,'POST')
            return Response({"success":f"Los datos se guardaron exitosamente"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error : {str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def suma_total(self):
        try:
            return sum([float(item["haber_soles"]) for item in self.request.data['items']])
        except Exception as e:
            raise ValueError(str(e))

    def delete_registers(self):
        try:
            document = self.kwargs['document']
            sql = f"DELETE FROM mova{self.fecha.year} WHERE ori_codigo=? AND mov_mes=? AND mov_compro=?"
            comprobante,mes,origen = self.kwargs['query_string'].split('-')
            params = (origen,mes,comprobante)
            res = self.query(document,sql,params,'POST')
            return res==-1
        except:
            raise ValueError('No se puede eactulizar los asientos')