from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from core.conn import DataBase
from config.middleware import TokenAuthentication
from core.views import Origen
class RegistroVentas(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    condicion : str = '='
    query_origen:str = ''
    query_titulo_gratuito:str = ''
    query_string:str=''
    qyery_mes : str = ''
    query_auxiliar:str = ''
    mes : str = ''
    def post(self,request,*args,**kwargs):
        """
        Condicion 1: Reporte mensual
        Condicion 2: Reporte acumulado
        """
        try:
            data = {}

            condicion = self.request.data['condicion']
            origen = self.request.data.get('origen','')
            titulo_gratuito = self.request.data['titulo_gratuito']
            mes  = self.request.data.get('mes','')
            auxiliar = self.request.data.get('auxiliar','')
            mes = str(mes).zfill(2)
            self.query_origen = f"a.ori_codigo={origen}"
            if origen=='':
                self.query_origen = self.get_origenes()
            if not titulo_gratuito:
                self.query_mes = f"a.mov_mes='{mes}' "
                self.query_titulo_gratuito = "WHERE mov_titgra=0"
            if auxiliar!='':
                self.query_auxiliar = f"AND c.aux_clave='{auxiliar}'"
            if titulo_gratuito:
                self.query_titulo_gratuito = "WHERE mov_titgra=1"
                query_origen = self.get_origenes()
                self.query_origen = f'{query_origen}'
                self.query_string1 = f'{self.query_titulo_gratuito}  '
                self.query_strign2 = f"WHERE {self.query_origen} {self.query_auxiliar}"
                data['data'] = self.reporte_acumulado()
            elif condicion==1:
                self.query_string1 = f"WHERE mov_titgra IN (0,1) "
                self.query_strign2 = f"WHERE {self.query_mes} AND {self.query_origen} {self.query_auxiliar} "
                data['data'] = self.reporte_mensual()
            elif condicion==2:
                self.query_string1 = f"WHERE mov_titgra=0 "
                self.query_mes = f"a.mov_mes<= '{mes}'"
                self.query_strign2 = f"WHERE {self.query_origen} AND {self.query_mes} {self.query_auxiliar} "
                data['data'] = self.reporte_acumulado()
            else:
                raise ValueError("Opcion no valida")
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})
    def reporte_mensual(self):
        try:
            
            sql = f"""
                        WITH data AS (
                            SELECT
                                mov_mes,
                                ori_codigo,
                                mov_compro,
                                MOV_SERIE,
                                MOV_DOCUM,
                                pla_cuenta,
                                mov_d,
                                mov_h,
                                mov_d_d,
                                mov_h_d,
                                identi,
                                MOV_FECHA,
                                aux_clave,
                                DOC_CODIGO,
                                MOV_T_C,
                                MOV_AFECTO,
                                MOV_MONED,
								mov_elimin
                            FROM mova2024
                                {self.query_string1}
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
                            'razon_social' = CASE WHEN mov_elimin=1 THEN  'DOCUMENTO ANULADO' ELSE c.AUX_RAZON END ,
                            'ruc_dni'=CASE WHEN mov_elimin=1 THEN '' ELSE c.aux_docum END,
                            'base_imponible' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) NOT IN ('13','16','17', '40') AND SUBSTRING(pla_cuenta,1,3)<>'121') AND UPPER(MOV_AFECTO)<>'I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'inafecto' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) NOT IN ('13','16','17', '40') AND SUBSTRING(pla_cuenta,1,3)<>'121') AND UPPER(MOV_AFECTO)='I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),

                            'igv' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) = '40' THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'total' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,3) = '121' OR SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'dolares' = (SELECT SUM(CASE 
													WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') OR SUBSTRING(pla_cuenta,1,3)='121') AND MOV_MONED='S' AND MOV_T_C<>0 THEN ROUND((MOV_D-MOV_H)/MOV_T_C,2)
													WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') OR SUBSTRING(pla_cuenta,1,3)='121') THEN MOV_D_D-MOV_H_D 
													ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes)   ,
                            'tipo_cambio' = CASE WHEN mov_elimin=1 THEN 0 ELSE b.mov_t_c END,
                            mov_elimin,
                            b.identi
                        
                        FROM (
                            SELECT DISTINCT mov_mes, ori_codigo, mov_compro FROM mova2024 WHERE (SUBSTRING(pla_cuenta,1,3) = '121' OR SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') AND MOV_AFECTO<>'I')
                        ) AS a
                        JOIN first_records AS f ON a.ori_codigo = f.ori_codigo AND a.mov_compro = f.mov_compro AND a.mov_mes = f.mov_mes
                        JOIN data AS b ON f.ori_codigo = b.ori_codigo AND f.mov_compro = b.mov_compro AND f.mov_mes = b.mov_mes AND f.min_identi = b.identi
                        LEFT JOIN t_auxiliar AS c ON b.aux_clave = c.AUX_CLAVE
                        {self.query_strign2}
	                    ORDER BY MOV_SERIE,MOV_DOCUM ASC
                        


                    """
       
            res = self.query(self.kwargs['document'],sql,(),'GET',1)

            data = [
                {
                    'id': value[-1],
                    "fecha": value[0].strftime("%Y-%m-%d"),
                    "tipo_documento": value[1].strip(),
                    "serie": value[2].strip(),
                    "numero_documento": value[3].strip(),
                    "razon_social": value[4].strip() ,
                    "ruc_dni": value[5].strip() ,
                    "base_imponible": value[6] ,
                    "inafecto": value[7],
                    "igv": value[8] ,
                    "total": value[9] ,
                    "dolares": value[10] ,
                    "tipo_cambio": value[11] ,
                    "state":value[-2]==1
                }
                for value in res
            ]
            return data
        except Exception as e:
            print(str(e))
            raise ValueError("Error en el reporte mensual")
            
    def reporte_acumulado(self):
        try:
            sql = f"""
            WITH data AS (
                    SELECT
                        mov_mes,
                        ori_codigo,
                        mov_compro,
                        pla_cuenta,
                        mov_d,
                        mov_h,
                        mov_d_d,
                        mov_h_d,
                        identi,
                        aux_clave,
                        MOV_AFECTO,
                        MOV_MONED,
                        MOV_T_C,
                        MOV_ELIMIN                
                    FROM mova2024
                        {self.query_string1}

                    
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
                    'razon_social'=ISNULL(t1.razon_social,''),
                    'dni_ruc'=ISNULL(t1.documento,''),
                    'base_imponible'=SUM(t1.base_imponible) ,
                    'inafecto'=SUM(t1.inafecto),
                    'igv'=SUM(t1.igv),
                    'total'=SUM(t1.total),
                    'dolares'=SUM(t1.dolares)
                FROM (SELECT
                    'razon_social' = CASE WHEN MOV_ELIMIN=1 THEN 'DOCUMENTO ANULADO' ELSE c.AUX_RAZON END,
                    'documento' = CASE WHEN MOV_ELIMIN=1 THEN '' ELSE c.aux_docum END,
                    'base_imponible' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN  (SUBSTRING(pla_cuenta,1,2) NOT IN ('13','16','17', '40') AND SUBSTRING(PLA_CUENTA,1,3)<> '121') AND UPPER(MOV_AFECTO)<>'I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'inafecto' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) NOT IN ('13','16','17', '40') AND SUBSTRING(PLA_CUENTA,1,3)<> '121') AND UPPER(MOV_AFECTO)='I'  THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),

                    'igv' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) ='40' THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'total' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,3) = '121' OR SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'dolares' = (SELECT SUM(CASE 
                                                    WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') OR SUBSTRING(pla_cuenta,1,3)='121') AND MOV_MONED='S' AND MOV_T_C<>0 THEN ROUND((MOV_D-MOV_H)/MOV_T_C,2)
                                                    WHEN MOV_ELIMIN=1 THEN 0 WHEN (SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') OR SUBSTRING(pla_cuenta,1,3)='121') THEN MOV_D_D-MOV_H_D 
                                                    ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes)

                FROM (
                    SELECT DISTINCT mov_mes, ori_codigo, mov_compro FROM mova2024 WHERE (SUBSTRING(pla_cuenta,1,3) = '121' OR SUBSTRING(pla_cuenta,1,2) IN ('13','16','17') AND MOV_AFECTO<>'I')
                ) AS a
                JOIN first_records AS f ON a.ori_codigo = f.ori_codigo AND a.mov_compro = f.mov_compro AND a.mov_mes = f.mov_mes
                JOIN data AS b ON f.ori_codigo = b.ori_codigo AND f.mov_compro = b.mov_compro AND f.mov_mes = b.mov_mes AND f.min_identi = b.identi
                LEFT JOIN t_auxiliar AS c ON b.aux_clave = c.AUX_CLAVE
                {self.query_strign2}) AS t1
                GROUP BY 
                    t1.razon_social,t1.documento
                ORDER BY t1.razon_social ASC
                """
            
     
            res = self.query(self.kwargs['document'],sql,(),'GET',1)

            data = [
                {
                    'id':index,
                    'razon_social':value[0].strip(),
                    'ruc_dni':value[1].strip(),
                    'base_imponible':value[2],
                    'inafecto':value[3],
                    'igv':value[4],
                    'total':value[5],
                    'dolares':value[6]

                } for index,value in enumerate(res)
            ] 
      
            return data
        except Exception as e:
            print(str(e))
            raise   ValueError("Error en el reporte acumulado")
    def get_origenes(self):
        try:
            origenes = Origen(self.kwargs['document'],self.request.data,self.query).get()
            return f"""a.ori_codigo IN  ({','.join(f" '{item['value'].strip()}' " for item in origenes)})"""
        except Exception as e:
            print(str(e))
            raise ValueError("Error al obtener los origenes")
        
class RegistroCompras(GenericAPIView,DataBase):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication]
    condicion : str = '='
    query_origen:str = ''
    query_titulo_gratuito:str = ''
    query_string:str=''
    qyery_mes : str = ''
    query_auxiliar:str = ''
    query_centro_costo:str = ''
    mes : str = ''
    def post(self,request,*args,**kwargs):
        """
        Condicion 1: Reporte mensual
        Condicion 2: Reporte acumulado
        """
        try:
            data = {}

            condicion = self.request.data['condicion']
            origen = self.request.data.get('origen','')
            titulo_gratuito = self.request.data['titulo_gratuito']
            mes  = self.request.data.get('mes','')
            auxiliar = self.request.data.get('auxiliar','')
            centro_costo_desde = request.data.get('desde','')
            centro_costo_hasta = request.data.get('hasta','')
            mes = str(mes).zfill(2)
            self.query_origen = f"a.ori_codigo={origen}"
            if origen=='':
                self.query_origen = self.get_origenes()
            if not titulo_gratuito:
                self.query_mes = f"a.mov_mes='{mes}' "
                self.query_titulo_gratuito = "WHERE mov_titgra=0"
            if auxiliar!='':
                self.query_auxiliar = f"AND c.aux_clave='{auxiliar}'"
            if centro_costo_desde!='' and centro_costo_hasta!='':
                self.query_centro_costo = f" AND (cco_codigo BETWEEN '{centro_costo_desde}' AND '{centro_costo_hasta}')"
            if titulo_gratuito:
                self.query_titulo_gratuito = "WHERE mov_titgra=1"
                query_origen = self.get_origenes()
                self.query_origen = f'{query_origen}'
                self.query_string1 = f'{self.query_titulo_gratuito}  '
                self.query_strign2 = f"WHERE {self.query_origen} {self.query_auxiliar}"
                data['data'] = self.reporte_acumulado()
            elif condicion==1:
                self.query_string1 = f"WHERE mov_titgra IN (0,1) "
                self.query_strign2 = f"WHERE {self.query_mes} AND {self.query_origen} {self.query_auxiliar} "
                data['data'] = self.reporte_mensual()
            elif condicion==2:
                self.query_string1 = f"WHERE mov_titgra=0 "
                self.query_mes = f"a.mov_mes<= '{mes}'"
                self.query_strign2 = f"WHERE {self.query_origen} AND {self.query_mes} {self.query_auxiliar} "
                data['data'] = self.reporte_acumulado()
            else:
                raise ValueError("Opcion no valida")
            data['success'] = True
            return Response(data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':f'Ocurrio un error : {str(e)}'})
    def reporte_mensual(self):
        try:
            
            sql = f"""
                        WITH data AS (
                            SELECT
                                mov_mes,
                                ori_codigo,
                                mov_compro,
                                MOV_SERIE,
                                MOV_DOCUM,
                                pla_cuenta,
                                mov_d,
                                mov_h,
                                mov_d_d,
                                mov_h_d,
                                identi,
                                MOV_FECHA,
                                aux_clave,
                                DOC_CODIGO,
                                MOV_T_C,
                                MOV_AFECTO,
                                MOV_MONED,
								mov_elimin
                            FROM mova2024
                                {self.query_string1}
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
                            'razon_social' = CASE WHEN mov_elimin=1 THEN  'DOCUMENTO ANULADO' ELSE c.AUX_RAZON END ,
                            'ruc_dni'=CASE WHEN mov_elimin=1 THEN '' ELSE c.aux_docum END,
                            'base_imponible' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) NOT IN ('28','40','42','43','46') AND UPPER(MOV_AFECTO)<>'I'  THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'inafecto' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) NOT IN ('28','40','42','43','46') AND UPPER(MOV_AFECTO)='I'  THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),

                            'igv' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) = '40' THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'total' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                            'dolares' = (SELECT SUM(CASE 
													WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') AND MOV_MONED='S' AND MOV_T_C<>0 THEN ROUND((MOV_H-MOV_D)/MOV_T_C,2)
													WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') THEN MOV_H_D-MOV_D_D 
													ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes)   ,
                            'tipo_cambio' = CASE WHEN mov_elimin=1 THEN 0 ELSE b.mov_t_c END,
                            b.mov_compro,
							b.ORI_CODIGO,
                            mov_elimin,

                            b.identi
                        
                        FROM (
                            SELECT DISTINCT mov_mes, ori_codigo, mov_compro FROM mova2024 WHERE SUBSTRING(pla_cuenta,1,2) IN ('28','42','43','46') AND MOV_AFECTO<>'I' {self.query_centro_costo}
                        ) AS a
                        JOIN first_records AS f ON a.ori_codigo = f.ori_codigo AND a.mov_compro = f.mov_compro AND a.mov_mes = f.mov_mes
                        JOIN data AS b ON f.ori_codigo = b.ori_codigo AND f.mov_compro = b.mov_compro AND f.mov_mes = b.mov_mes AND f.min_identi = b.identi
                        LEFT JOIN t_auxiliar AS c ON b.aux_clave = c.AUX_CLAVE
                        {self.query_strign2}
	                    ORDER BY b.mov_compro, b.MOV_SERIE,b.MOV_DOCUM ASC
                    """

            res = self.query(self.kwargs['document'],sql,(),'GET',1)

            data = [
                {
                    'id': value[-1],
                    "fecha": value[0].strftime("%Y-%m-%d"),
                    "tipo_documento": value[1].strip(),
                    "serie": value[2].strip(),
                    "numero_documento": value[3].strip(),
                    "razon_social": value[4].strip() ,
                    "ruc_dni": value[5].strip() ,
                    "base_imponible": value[6] ,
                    "inafecto": value[7],
                    "igv": value[8] ,
                    "total": value[9] ,
                    "dolares": value[10] ,
                    "tipo_cambio": value[11] ,
                    "comprobante": value[12] ,
                    "origen": value[13] ,
                    "state":value[-2]==1
                }
                for value in res
            ]
            return data
        except Exception as e:
            print(str(e))
            raise ValueError("Error en el reporte mensual")
            
    def reporte_acumulado(self):
        try:
            sql = f"""
            WITH data AS (
                    SELECT
                        mov_mes,
                        ori_codigo,
                        mov_compro,
                        pla_cuenta,
                        mov_d,
                        mov_h,
                        mov_d_d,
                        mov_h_d,
                        identi,
                        aux_clave,
                        MOV_AFECTO,
                        MOV_MONED,
                        MOV_T_C,
                        MOV_ELIMIN                
                    FROM mova2024
                        {self.query_string1}

                    
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
                    'razon_social'=ISNULL(t1.razon_social,''),
                    'dni_ruc'=ISNULL(t1.documento,''),
                    'base_imponible'=SUM(t1.base_imponible) ,
                    'inafecto'=SUM(t1.inafecto),
                    'igv'=SUM(t1.igv),
                    'total'=SUM(t1.total),
                    'dolares'=SUM(t1.dolares)
                FROM (SELECT
                    'razon_social' = CASE WHEN MOV_ELIMIN=1 THEN 'DOCUMENTO ANULADO' ELSE c.AUX_RAZON END,
                    'documento' = CASE WHEN MOV_ELIMIN=1 THEN '' ELSE c.aux_docum END,
                    'base_imponible' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN  SUBSTRING(pla_cuenta,1,2) NOT IN ('28','40','42','43','46') AND UPPER(MOV_AFECTO)<>'I'  THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'inafecto' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) NOT IN ('28','40','42','43','46') AND UPPER(MOV_AFECTO)='I'  THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),

                    'igv' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) ='40' THEN mov_d - mov_h ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'total' = (SELECT SUM(CASE WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') THEN mov_h - mov_d ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes),
                    'dolares' = (SELECT SUM(CASE 
                                                    WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') AND MOV_MONED='S' AND MOV_T_C<>0 THEN ROUND((MOV_h-MOV_d)/MOV_T_C,2)
                                                    WHEN MOV_ELIMIN=1 THEN 0 WHEN SUBSTRING(pla_cuenta,1,2) IN ('28','42','43', '46') THEN MOV_H_D-MOV_D_D 
                                                    ELSE 0 END) FROM data WHERE ORI_CODIGO = a.ori_codigo AND MOV_COMPRO = a.mov_compro AND MOV_MES = a.mov_mes)

                FROM (
                    SELECT DISTINCT mov_mes, ori_codigo, mov_compro FROM mova2024 WHERE SUBSTRING(pla_cuenta,1,2) IN ('28','42','43','46') AND MOV_AFECTO<>'I' {self.query_centro_costo}
                ) AS a
                JOIN first_records AS f ON a.ori_codigo = f.ori_codigo AND a.mov_compro = f.mov_compro AND a.mov_mes = f.mov_mes
                JOIN data AS b ON f.ori_codigo = b.ori_codigo AND f.mov_compro = b.mov_compro AND f.mov_mes = b.mov_mes AND f.min_identi = b.identi
                LEFT JOIN t_auxiliar AS c ON b.aux_clave = c.AUX_CLAVE
                {self.query_strign2}) AS t1
                GROUP BY 
                    t1.razon_social,t1.documento
                ORDER BY t1.razon_social ASC
                """
            

            res = self.query(self.kwargs['document'],sql,(),'GET',1)

            data = [
                {
                    'id':index,
                    'razon_social':value[0].strip(),
                    'ruc_dni':value[1].strip(),
                    'base_imponible':value[2],
                    'inafecto':value[3],
                    'igv':value[4],
                    'total':value[5],
                    'dolares':value[6]

                } for index,value in enumerate(res)
            ] 
      
            return data
        except Exception as e:
            print(str(e))
            raise   ValueError("Error en el reporte acumulado")
    def get_origenes(self):
        try:
            origenes = Origen(self.kwargs['document'],self.request.data,self.query).get()
            return f"""a.ori_codigo IN  ({','.join(f" '{item['value'].strip()}' " for item in origenes)})"""
        except Exception as e:
            print(str(e))
            raise ValueError("Error al obtener los origenes")