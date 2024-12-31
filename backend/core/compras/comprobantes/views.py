from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from core.conn import DataBase
from config.middleware import TokenAuthentication
from datetime import datetime

class ListComprobantes(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha:datetime = datetime.now()
    def post(self,request,*args,**kwargs):
        try:
            document = kwargs["document"]
            tipo_origen = request.data["tipo_origen"]
            sql = f"""
                SELECT distinct a.MOV_FECHA,a.mov_mes,a.ORI_CODIGO,a.MOV_COMPRO, 
                    a.MOV_SERIE,a.MOV_DOCUM,c.AUX_RAZON,c.AUX_DOCUM,a.mov_total,a.MOV_GLOSA 
                FROM mova{self.fecha.year} AS a
                LEFT JOIN t_origen AS b ON a.ORI_CODIGO = b.ori_codigo
                LEFT JOIN t_auxiliar AS c ON a.AUX_CLAVE = c.AUX_CLAVE
                WHERE b.ori_tipo = 1
                ORDER BY a.MOV_FECHA DESC
"""
            params = (tipo_origen,)
            res  = self.query(document,sql,(),"GET",1)
            data = [
                {
                    "id":index,
                    "fecha":self.format_date(value[0]),
                    "mes":value[1].strip(),
                    "origen":value[2].strip(),
                    "comprobante":value[3],
                    "serie":value[4].strip(),
                    "numero":value[5],
                    "razon_social":value[6].strip(),
                    "ruc":value[7].strip(),
                    "total":f" {value[8]:.2f}",
                    "obs":value[9].strip(),
                } for index,value in enumerate(res)
            ]
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def format_date(self,date:datetime):
        try:
            return date.strftime("%Y-%m-%d")
        except:
            return date
class EditComprobantes(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    fecha :datetime = datetime.now() 
    def get(self,request,*args,**kwargs):
        try:
  
            data = {}
            document = kwargs['document']
            comprobante,mes,origen = kwargs['query_string'].split("-")
            sql = f"""SELECT
                            MOV_FECHAC,mov_femisi,mov_diapag,MOV_FVENC,ORI_CODIGO,UBI_CODIGO,mov_coddet,mov_detrae,mov_detraf,mov_detrac,MOV_GLOSA,
                            AUX_CLAVE,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,doc_codref,mov_serref,mov_docref,mov_fecref,mov_tcref,PLA_CUENTA,
                            CCO_CODIGO,ubi_codcaj,MOV_MONED,MOV_H,MOV_D,MOV_T_C,MOV_H_D,MOV_D_D,MOV_GLOSA1,MOV_AFECTO,identi
                        FROM MOVA{self.fecha.year} 
                        WHERE MOV_MES=? AND ORI_CODIGO=? AND MOV_COMPRO=? 
"""
            params = (mes,origen,comprobante)
            result = self.query(document,sql,params,"GET",1)

            res = result[0]
            form_header = {
                'fecha_contable':res[0].strftime('%Y-%m-%d'),
                'fecha_emision':res[1].strftime('%Y-%m-%d'),
                'dias':res[2],
                'fecha_vencimiento':res[3].strftime('%Y-%m-%d'),
                'origen':res[4].strip(),
                'ubicacion':res[5].strip(),
                'detraccion':res[6]==1,
                'codigo_detracion':res[7],
                'fecha_detraccion':res[8].strftime('%Y-%m-%d'),
                'numero_detraccion':res[9].strip(),
                'observacion':res[10].strip(),
                'proveedor':res[11].strip(),
                'tipo_documento':res[12].strip(),
                'serie':res[13].strip(),
                'numero':res[14].strip(),
                'documento_referencia':res[15].strip(),
                'serie_referencia':res[16].strip(),
                'numero_referencia':res[17],
                'fecha_referencia':res[18].strftime('%Y-%m-%d'),
                'tipo_cambio_referencia':res[19],

            }
            table = [
                {
                    'id':value[-1],
                    'cuenta':value[20].strip(),
                    'centro_costo':value[21].strip(),
                    'caja':value[22].strip(),
                    'moneda':value[23].strip(),
                    'haber_soles':value[24],
                    'debe_soles':value[25],
                    'tipo_cambio':value[26],
                    'haber_dolares':value[27],
                    'debe_dolares':value[28],
                    'observacion':value[29].strip(),
                    'inafecto':value[30].strip(),
                    'fecha_vencimiento':value[3].strftime('%Y-%m-%d'),
                } for value in result
            ]
            data['data']= {
                'form_header':form_header,
                'table_list':table,
            }
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def post(self,request,*args,**kwargs):
        try:
            data = {}
            datos = request.data
            comprobante,mes,origen = kwargs['query_string'].split("-")
            sql = f"DELETE FROM MOVA{self.fecha.year} WHERE ORI_CODIGO=? AND MOV_COMPRO=? AND MOV_MES=?"
            params = (origen,comprobante,mes)
            res = self.query(kwargs['document'],sql,params,"POST")
            if res!=-1:
                raise ValueError("Error al eliminar el comprobante")
            sql = f"""INSERT INTO MOVA{self.fecha.year}(
            alm_codigo,mov_mes,ORI_CODIGO,UBI_CODIGO,MOV_COMPRO,mov_fecha,MOV_GLOSA,PLA_CUENTA,aux_clave,DOC_CODIGO,MOV_SERIE,MOV_DOCUM,MOV_D,MOV_H,MOV_D_D,MOV_H_D,MOV_T_C,MOV_GLOSA1,USUARIO,ven_codigo,mov_tipoas,mov_total,mov_femisi,mov_moned,mov_fvenc,mov_diapag,mov_coddet,mov_detrae,mov_detraf,mov_detrac
            ) VALUES """

            for item in datos['items']:
                total = self.sum_total()
                detraccion = 1 if datos.get('detraccion',False) else 0
                params = ('53',mes,origen,datos['ubicacion'],comprobante,datos['fecha_emision'],item['observacion'],item['cuenta'],datos['proveedor'],datos['tipo_documento'],datos.get('serie',''),datos.get('numero',''),item['debe_soles'],item['haber_soles'],item['debe_dolares'],item['haber_dolares'],datos['tipo_cambio'],datos['observacion'],datos['codigo_usuario'],datos['codigo_vendedor'],datos['tipo_asiento'],total,datos['fecha_emision'],item['moneda'],datos['fecha_vencimiento'],datos['dias'],datos.get('codigo_detraccion',''),detraccion,datos.get('fecha_detraccion','1900-01-01'),datos.get('numero_detraccion',''))
                sql1 = sql+f"({','.join('?' for i in params)})"
                res = self.query(kwargs['document'],sql1,params,"POST")
                if res!=-1:
                    raise ValueError("Error al insertar los comprobantes")
            data['success'] = True
            data['message'] = 'Los datos se guardaron correctamente'
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":f"Ocurrio un error:{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    def sum_total(self):
        try:
            return sum([float(item["haber_soles"]) for item in self.request.data["items"]])
        except Exception as e:
            raise ValueError(str(e))
