from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from core.conn import DataBase
from config.middleware import TokenAuthentication

class RegistroVentas(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    def post(self,request,*args,**kwargs):
        try:
            data = {}
          
            document = kwargs['document']
            sql = f"""
                        WITH data AS (
                            SELECT
                                mov_mes,
                                ori_codigo,
                                mov_compro,
                                MOV_SERIE,
                                MOV_DOCUM,
                                SUBSTRING(pla_cuenta, 1, 2) AS cuenta_prefix,
                                mov_d,
                                mov_h,
                                mov_d_d,
                                mov_h_d,
                                identi,
                                MOV_FECHA,
                                aux_clave,
                                DOC_CODIGO,
                                MOV_T_C,
                                MOV_AFECTO
                            
                            FROM mova2024
                        ),
                        first_records AS (
                            SELECT
                                ori_codigo,
                                mov_compro,
                                mov_mes,
                                MIN(identi) AS min_identi
                            FROM data
                            GROUP BY ori_codigo, mov_compro, mov_mes
                        )

                        SELECT
                            b.mov_fecha,
                            b.DOC_CODIGO,
                            b.MOV_SERIE,
                            b.MOV_DOCUM,
                            c.AUX_RAZON,
                            c.aux_docum,
                            'base_imponible' = (SELECT SUM(CASE WHEN cuenta_prefix NOT IN ('12', '40') AND UPPER(MOV_AFECTO)<>'I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'inafecto' = (SELECT SUM(CASE WHEN cuenta_prefix NOT IN ('12', '40') AND UPPER(MOV_AFECTO)='I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),

                            'igv' = (SELECT SUM(CASE WHEN cuenta_prefix = '40' THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'total' = (SELECT SUM(CASE WHEN cuenta_prefix = '12' THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'dolares' = (SELECT SUM(CASE WHEN cuenta_prefix = '12' THEN mov_d_d - mov_h_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            b.mov_t_c,
                            b.identi
                        
                        FROM (
                            SELECT DISTINCT mov_mes, ori_codigo, mov_compro FROM mova2024
                        ) AS a
                        JOIN first_records AS f ON a.ori_codigo = f.ori_codigo AND a.mov_compro = f.mov_compro AND a.mov_mes = f.mov_mes
                        JOIN data AS b ON f.ori_codigo = b.ori_codigo AND f.mov_compro = b.mov_compro AND f.mov_mes = b.mov_mes AND f.min_identi = b.identi
                        LEFT JOIN t_auxiliar AS c ON b.aux_clave = c.AUX_CLAVE
                        WHERE 
                            a.mov_mes = ?
                            AND a.ori_codigo = '03';


                    """
            mes = str(request.data['mes']).zfill(2)
            params = (mes,)
 
            res = self.query(document,sql,params,'GET',1)

            data['data'] = [
                {
                    'id':value[-1],
                    "fecha":value[0].strftime("%Y-%m-%d"),
                    'tipo_documento':value[1].strip(),
                    "serie":value[2].strip(),
                    "numero_documento":value[3].strip(),
                    "razon_social":value[4].strip(),
                    "ruc_dni":value[5].strip(),
                    "base_imponible":value[6],
                    "inafecto":value[7],
                    "igv":value[8],
                    "total":value[9],
                    "dolares":value[10],
                    "tipo_cambio":value[11],
                } for value in res
            ]
            


            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            Response({'error':f'Ocurrio un error : {str(e)}'})
